/**
 * Notion Webhook Handler for Email Campaign Automation
 * Receives webhook when "Schedule" checkbox is checked in Notion database
 * Stores lead data in Vercel KV for automated email sequence
 */

import { kv, storeLead } from '../utils/kv.js';

export default async function handler(req, res) {
  // Verify webhook authentication
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  const expectedSecret = process.env.WEBHOOK_SECRET;

  if (!expectedSecret) {
    console.error('WEBHOOK_SECRET environment variable not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Extract token from "Bearer TOKEN" format, handling whitespace
  const token = authHeader?.replace(/^Bearer\s+/i, '').trim();

  if (token !== expectedSecret) {
    console.warn('Unauthorized webhook attempt', {
      receivedHeader: authHeader?.substring(0, 30),
      receivedToken: token?.substring(0, 20),
      expectedToken: expectedSecret.substring(0, 20),
      headers: JSON.stringify(req.headers)
    });
    return res.status(401).json({
      error: 'Unauthorized',
      debug: {
        receivedTokenPrefix: token?.substring(0, 10),
        expectedTokenPrefix: expectedSecret.substring(0, 10)
      }
    });
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Received Notion webhook');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Handle Notion automation webhook format (nested under 'data')
    const pageData = req.body.data || req.body;
    const page_id = pageData.id || req.body.page_id;
    const properties = pageData.properties || req.body.properties;

    if (!page_id || !properties) {
      console.error('Missing page_id or properties in webhook payload');
      console.error('Full body:', JSON.stringify(req.body, null, 2));
      return res.status(400).json({
        error: 'Invalid webhook payload',
        message: 'Missing page_id or properties',
        received: {
          hasPageId: !!page_id,
          hasProperties: !!properties,
          bodyKeys: Object.keys(req.body || {}),
          dataKeys: Object.keys(req.body.data || {})
        }
      });
    }

    // Check if instant mode is requested (via header or property)
    const instantHeader = req.headers['x-instant-mode'] || req.headers['X-Instant-Mode'];
    console.log('Instant mode header received:', instantHeader);
    console.log('All headers:', JSON.stringify(req.headers, null, 2));

    const instantMode = instantHeader?.toLowerCase() === 'true' ||
                       properties['Instant']?.checkbox === true ||
                       properties['Send Instantly']?.checkbox === true;

    console.log('Mode:', instantMode ? 'INSTANT - Email will be sent immediately' : 'QUEUED - Email scheduled for Monday');
    console.log('Instant mode evaluated to:', instantMode);

    // Extract lead data from Notion properties
    const leadData = {
      pageId: page_id,

      // Basic Info
      companyName: extractText(properties['Company Name']?.title),
      email: properties['Email']?.email || '',
      demoUrl: properties['Demo URL']?.url || 'https://dentist.blosm.dev/',

      // Email 1 (Initial Outreach - Monday)
      email1Subject: extractText(properties['Email Stage 1 Subject']?.rich_text),
      email1Body: extractText(properties['Email Stage 1 Body']?.rich_text),

      // Email 2 (Follow-up - Thursday)
      email2Subject: extractText(properties['Email Stage 2 Subject']?.rich_text),
      email2Body: extractText(properties['Email Stage 2 Body']?.rich_text),

      // Email 3 (Final Follow-up - Next Monday)
      email3Subject: extractText(properties['Email Stage 3 Subject']?.rich_text),
      email3Body: extractText(properties['Email Stage 3 Body']?.rich_text),
    };

    console.log('Extracted lead data:', {
      email: leadData.email,
      company: leadData.companyName,
      demoUrl: leadData.demoUrl,
      hasEmail1: !!(leadData.email1Subject && leadData.email1Body),
      hasEmail2: !!(leadData.email2Subject && leadData.email2Body),
      hasEmail3: !!(leadData.email3Subject && leadData.email3Body)
    });

    // Validate required fields
    const missingFields = [];

    if (!leadData.email) missingFields.push('Email');
    if (!leadData.companyName) missingFields.push('Company Name');
    if (!leadData.email1Subject) missingFields.push('Email 1 Subject');
    if (!leadData.email1Body) missingFields.push('Email 1 Body');

    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      console.error('Lead data received:', leadData);
      return res.status(400).json({
        error: 'Missing required fields',
        missing: missingFields,
        message: `Please fill in: ${missingFields.join(', ')}`,
        receivedData: {
          email: leadData.email || 'MISSING',
          companyName: leadData.companyName || 'MISSING',
          email1Subject: leadData.email1Subject || 'MISSING',
          email1Body: leadData.email1Body ? `${leadData.email1Body.substring(0, 50)}...` : 'MISSING'
        }
      });
    }

    // Validate email format
    if (!isValidEmail(leadData.email)) {
      console.error('Invalid email format:', leadData.email);
      return res.status(400).json({
        error: 'Invalid email format',
        email: leadData.email,
        message: 'Email must be in format: user@domain.com'
      });
    }

    // Handle instant mode - send Email 1 immediately
    if (instantMode) {
      console.log('\n📧 INSTANT MODE: Sending Email 1 immediately...');

      try {
        // Import the email sending function and rate limiter
        const { sendCampaignEmail } = await import('../utils/resend-campaign.js');
        const { waitForRateLimit } = await import('../utils/rate-limiter.js');

        // Wait for rate limit clearance (prevents hitting Resend API limits)
        await waitForRateLimit();

        // Send Email 1 immediately
        const emailResult = await sendCampaignEmail(leadData, 1);
        console.log('✓ Email 1 sent successfully!');
        console.log('  Resend ID:', emailResult?.data?.id || emailResult?.id || 'unknown');

        // Update lead status and store in KV for Email 2
        leadData.status = 'email1_sent';
        leadData.email1SentAt = new Date().toISOString();
        leadData.queuedAt = new Date().toISOString();
        leadData.lastUpdated = new Date().toISOString();

        // Store/update lead in KV
        await kv.set(`lead:${leadData.email}`, leadData);

        // Add to email1_sent set (for Thursday cron to pick up)
        await kv.sadd('leads:email1_sent', leadData.email);

        // Remove from queued if present
        await kv.srem('leads:queued', leadData.email);

        console.log('✅ Lead processed in INSTANT mode');
        console.log('  → Email 1: SENT NOW');
        console.log('  → Email 2: Thursday 7:50am GMT');
        console.log('  → Email 3: Next Monday 7:50am GMT');

        // Success response for instant mode
        res.status(200).json({
          success: true,
          message: 'Email 1 sent immediately, Email 2 scheduled for Thursday',
          mode: 'instant',
          data: {
            email: leadData.email,
            company: leadData.companyName,
            demoUrl: leadData.demoUrl,
            stage: 'email1_sent',
            email1SentAt: leadData.email1SentAt,
            nextEmail: 'Email 2 - Thursday 7:50am GMT',
            campaignSequence: {
              email1: 'Sent ✓',
              email2: leadData.email2Subject ? 'Scheduled for Thursday' : 'Not configured',
              email3: leadData.email3Subject ? 'Scheduled for Monday' : 'Not configured'
            }
          }
        });

      } catch (emailError) {
        console.error('❌ Failed to send instant email:', emailError.message);

        // Still save the lead but in queued state for retry
        leadData.status = 'queued';
        leadData.error = `Instant send failed: ${emailError.message}`;

        const stored = await storeLead(leadData);

        res.status(500).json({
          error: 'Failed to send instant email, lead queued for Monday',
          message: emailError.message,
          data: {
            email: leadData.email,
            company: leadData.companyName,
            fallback: 'Lead queued for Monday cron job'
          }
        });
      }

    } else {
      // QUEUED MODE - Original behavior
      const stored = await storeLead(leadData);

      if (!stored) {
        throw new Error('Failed to store lead in KV');
      }

      console.log(`✓ Lead queued successfully: ${leadData.email} (${leadData.companyName})`);
      console.log(`  → Email 1 will be sent next Monday at 7:50am GMT`);

      // Success response for queued mode
      res.status(200).json({
        success: true,
        message: 'Lead queued for automated campaign',
        mode: 'queued',
        data: {
          email: leadData.email,
          company: leadData.companyName,
          demoUrl: leadData.demoUrl,
          stage: 'queued',
          nextEmail: 'Email 1 - Monday 7:50am GMT',
          campaignSequence: {
            email1: leadData.email1Subject ? 'Ready' : 'Missing',
            email2: leadData.email2Subject ? 'Ready' : 'Not configured',
            email3: leadData.email3Subject ? 'Ready' : 'Not configured'
          }
        }
      });
    }

  } catch (error) {
    console.error('Notion webhook error:', error);

    res.status(500).json({
      error: 'Failed to process webhook',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

/**
 * Extract text from Notion rich text or title field
 * @param {Array|undefined} richTextArray - Notion rich text array
 * @returns {string} Extracted text
 */
function extractText(richTextArray) {
  if (!richTextArray || !Array.isArray(richTextArray)) {
    return '';
  }

  return richTextArray
    .map(item => item?.text?.content || item?.plain_text || '')
    .join('')
    .trim();
}

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} True if valid
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
