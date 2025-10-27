/**
 * Notion Webhook Handler for Email Campaign Automation
 * Receives webhook when "Schedule" checkbox is checked in Notion database
 * Stores lead data in Vercel KV for automated email sequence
 */

import { storeLead } from '../utils/kv.js';

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

    // Store lead in Vercel KV
    const stored = await storeLead(leadData);

    if (!stored) {
      throw new Error('Failed to store lead in KV');
    }

    console.log(`✓ Lead queued successfully: ${leadData.email} (${leadData.companyName})`);
    console.log(`  → Email 1 will be sent next Monday at 7:50am GMT`);

    // Success response
    res.status(200).json({
      success: true,
      message: 'Lead queued for automated campaign',
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
