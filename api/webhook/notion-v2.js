/**
 * Notion Webhook v2 - All Email Stages Handler
 * Handles Email 1, 2, and 3 via Notion automation triggers
 * Optimized for batch webhook calls with distributed rate limiting
 */

import { kv } from '../utils/kv.js';
import { sendCampaignEmail } from '../utils/resend-campaign.js';
import { waitForRateLimit } from '../utils/rate-limiter.js';

export default async function handler(req, res) {
  const startTime = Date.now();

  // Verify authentication
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  const token = authHeader?.replace(/^Bearer\s+/i, '').trim();

  if (token !== process.env.WEBHOOK_SECRET) {
    console.warn('Unauthorized webhook attempt');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract payload (handle Notion's nested format)
    const pageData = req.body.data || req.body;
    const page_id = pageData.id || req.body.page_id;
    const properties = pageData.properties || req.body.properties;

    if (!page_id || !properties) {
      return res.status(400).json({ error: 'Invalid payload: missing page_id or properties' });
    }

    // Determine which email stage to send (1, 2, or 3)
    const emailStageHeader = req.headers['x-email-stage'] || req.headers['X-Email-Stage'];
    const emailStageProperty = properties['Email Stage']?.number || properties['email_stage']?.number;
    const emailStage = parseInt(emailStageHeader || emailStageProperty || 1);

    if (![1, 2, 3].includes(emailStage)) {
      return res.status(400).json({ error: 'Invalid email_stage: must be 1, 2, or 3' });
    }

    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📧 Notion Webhook: Email ${emailStage}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    // Extract lead data
    const leadData = extractLeadData(page_id, properties, emailStage);

    // Validate required fields
    const validation = validateLeadData(leadData, emailStage);
    if (!validation.valid) {
      console.error('Validation failed:', validation.errors);
      return res.status(400).json({
        error: 'Missing required fields',
        details: validation.errors,
        received: {
          hasEmail: !!leadData.email,
          hasSubject: !!leadData[`email${emailStage}Subject`],
          hasBody: !!leadData[`email${emailStage}Body`],
          hasDemoUrl: !!leadData.demoUrl
        }
      });
    }

    console.log(`Lead: ${leadData.businessName} (${leadData.email})`);
    console.log(`Stage: Email ${emailStage}`);

    // Process asynchronously to return 200 quickly
    // This prevents Notion from timing out or retrying
    setImmediate(async () => {
      try {
        await processEmailSend(leadData, emailStage);
      } catch (error) {
        console.error(`Background processing error for ${leadData.email}:`, error);
      }
    });

    // Return success immediately (before email is sent)
    const processingTime = Date.now() - startTime;
    return res.status(200).json({
      success: true,
      message: `Email ${emailStage} queued for ${leadData.email}`,
      email: leadData.email,
      stage: emailStage,
      processingTime: `${processingTime}ms`
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}

/**
 * Process email sending with rate limiting
 */
async function processEmailSend(leadData, emailStage) {
  const startTime = Date.now();

  try {
    console.log(`\n⏳ Waiting for rate limit clearance...`);

    // Wait for rate limit (ensures 500ms between emails)
    await waitForRateLimit();

    console.log(`✓ Rate limit cleared, sending Email ${emailStage}...`);

    // Send the email
    const emailResult = await sendCampaignEmail(leadData, emailStage);

    if (!emailResult?.data?.id && !emailResult?.id) {
      throw new Error('No email ID returned from Resend');
    }

    const resendId = emailResult?.data?.id || emailResult?.id;
    console.log(`✅ Email ${emailStage} sent successfully!`);
    console.log(`   Resend ID: ${resendId}`);
    console.log(`   Total time: ${Date.now() - startTime}ms`);

    // Update lead status in KV
    await updateLeadStatus(leadData, emailStage, resendId);

  } catch (error) {
    console.error(`❌ Failed to send Email ${emailStage} to ${leadData.email}:`, error.message);

    // Store error in KV for debugging
    await kv.set(`lead:${leadData.email}:error`, {
      stage: emailStage,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Update lead status after email is sent
 */
async function updateLeadStatus(leadData, emailStage, resendId) {
  const statusMap = {
    1: 'email1_sent',
    2: 'email2_sent',
    3: 'completed'
  };

  const timestampField = `email${emailStage}SentAt`;
  const status = statusMap[emailStage];

  // Update lead data
  leadData.status = status;
  leadData[timestampField] = new Date().toISOString();
  leadData.lastUpdated = new Date().toISOString();
  leadData[`email${emailStage}ResendId`] = resendId;

  // Store in KV
  await kv.set(`lead:${leadData.email}`, leadData);

  // Update status sets
  await kv.sadd(`leads:${status}`, leadData.email);

  // Remove from previous stage set
  if (emailStage === 1) {
    await kv.srem('leads:queued', leadData.email);
  } else if (emailStage === 2) {
    await kv.srem('leads:email1_sent', leadData.email);
  } else if (emailStage === 3) {
    await kv.srem('leads:email2_sent', leadData.email);
  }

  console.log(`✓ Lead status updated: ${status}`);
}

/**
 * Extract lead data from Notion properties
 */
function extractLeadData(page_id, properties, emailStage) {
  return {
    pageId: page_id,
    businessName: properties['Business Name']?.title?.[0]?.plain_text ||
                  properties['business_name']?.title?.[0]?.plain_text ||
                  'Unknown Business',
    email: properties['Email']?.email ||
           properties['email']?.email || '',
    contactName: properties['Contact Name']?.rich_text?.[0]?.plain_text ||
                 properties['contact_name']?.rich_text?.[0]?.plain_text || '',
    phone: properties['Phone']?.phone_number ||
           properties['phone']?.phone_number || '',
    website: properties['Website']?.url ||
             properties['website']?.url || '',
    businessType: properties['Business Type']?.select?.name ||
                  properties['business_type']?.select?.name || '',

    // Demo URL (required)
    demoUrl: properties['Demo URL']?.url ||
             properties['demo_url']?.url ||
             properties['Vercel URL']?.url ||
             properties['vercel_url']?.url || '',

    // Email content (pre-generated by previous automation)
    email1Subject: properties['Email 1 Subject']?.rich_text?.[0]?.plain_text ||
                   properties['email_1_subject']?.rich_text?.[0]?.plain_text || '',
    email1Body: properties['Email 1 Body']?.rich_text?.[0]?.plain_text ||
                properties['email_1_body']?.rich_text?.[0]?.plain_text || '',
    email2Subject: properties['Email 2 Subject']?.rich_text?.[0]?.plain_text ||
                   properties['email_2_subject']?.rich_text?.[0]?.plain_text || '',
    email2Body: properties['Email 2 Body']?.rich_text?.[0]?.plain_text ||
                properties['email_2_body']?.rich_text?.[0]?.plain_text || '',
    email3Subject: properties['Email 3 Subject']?.rich_text?.[0]?.plain_text ||
                   properties['email_3_subject']?.rich_text?.[0]?.plain_text || '',
    email3Body: properties['Email 3 Body']?.rich_text?.[0]?.plain_text ||
                properties['email_3_body']?.rich_text?.[0]?.plain_text || '',

    // Metadata
    queuedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Validate required fields for lead data
 */
function validateLeadData(leadData, emailStage) {
  const errors = [];

  // Email is always required
  if (!leadData.email || !leadData.email.includes('@')) {
    errors.push('Email address is required and must be valid');
  }

  // Demo URL is required for all stages
  if (!leadData.demoUrl) {
    errors.push('Demo URL is required (property: "Demo URL" or "demo_url")');
  }

  // Subject and body are required for the specific email stage
  const subjectField = `email${emailStage}Subject`;
  const bodyField = `email${emailStage}Body`;

  if (!leadData[subjectField]) {
    errors.push(`Email ${emailStage} Subject is required (property: "Email ${emailStage} Subject" or "email_${emailStage}_subject")`);
  }

  if (!leadData[bodyField]) {
    errors.push(`Email ${emailStage} Body is required (property: "Email ${emailStage} Body" or "email_${emailStage}_body")`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
