/**
 * Batch Webhook Handler for Multiple Leads
 * Processes multiple lead email sends in a single request
 * Optimized for Notion automations that can batch multiple records
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
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { leads, email_stage = 1 } = req.body;

    if (!Array.isArray(leads) || leads.length === 0) {
      return res.status(400).json({
        error: 'Invalid payload: leads must be a non-empty array'
      });
    }

    if (![1, 2, 3].includes(email_stage)) {
      return res.status(400).json({
        error: 'Invalid email_stage: must be 1, 2, or 3'
      });
    }

    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📧 Batch Webhook: ${leads.length} leads, Email ${email_stage}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    // Queue all leads for processing
    const queuedLeads = leads.map(lead => ({
      ...lead,
      email_stage,
      queued_at: new Date().toISOString()
    }));

    // Store in Redis for async processing
    await kv.set('batch:processing', {
      leads: queuedLeads,
      stage: email_stage,
      total: leads.length,
      processed: 0,
      startedAt: new Date().toISOString()
    });

    // Process asynchronously
    setImmediate(async () => {
      await processBatchEmails(queuedLeads, email_stage);
    });

    // Return immediately
    return res.status(200).json({
      success: true,
      message: `${leads.length} leads queued for Email ${email_stage}`,
      total: leads.length,
      stage: email_stage,
      processingTime: `${Date.now() - startTime}ms`
    });

  } catch (error) {
    console.error('Batch webhook error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}

/**
 * Process batch emails with rate limiting
 */
async function processBatchEmails(leads, emailStage) {
  const results = {
    total: leads.length,
    sent: 0,
    failed: 0,
    errors: []
  };

  console.log(`\n🔄 Processing ${leads.length} emails for stage ${emailStage}...`);

  for (const lead of leads) {
    try {
      // Rate limiting (500ms between emails)
      await waitForRateLimit();

      // Send email
      const emailResult = await sendCampaignEmail(lead, emailStage);

      if (emailResult?.data?.id || emailResult?.id) {
        results.sent++;
        console.log(`✓ Email ${emailStage} sent to ${lead.email}`);

        // Update lead status
        await updateLeadStatus(lead, emailStage, emailResult?.data?.id || emailResult?.id);
      } else {
        throw new Error('No email ID returned from Resend');
      }

    } catch (error) {
      results.failed++;
      results.errors.push({
        email: lead.email,
        error: error.message
      });
      console.error(`✗ Failed to send to ${lead.email}:`, error.message);
    }
  }

  // Store final results
  await kv.set('batch:results:latest', {
    ...results,
    stage: emailStage,
    completedAt: new Date().toISOString()
  });

  console.log(`\n✅ Batch processing complete:`);
  console.log(`   Sent: ${results.sent}/${results.total}`);
  console.log(`   Failed: ${results.failed}`);
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

  const status = statusMap[emailStage];
  const timestampField = `email${emailStage}SentAt`;

  leadData.status = status;
  leadData[timestampField] = new Date().toISOString();
  leadData.lastUpdated = new Date().toISOString();
  leadData[`email${emailStage}ResendId`] = resendId;

  await kv.set(`lead:${leadData.email}`, leadData);
  await kv.sadd(`leads:${status}`, leadData.email);

  // Remove from previous stage
  if (emailStage === 1) {
    await kv.srem('leads:queued', leadData.email);
  } else if (emailStage === 2) {
    await kv.srem('leads:email1_sent', leadData.email);
  } else if (emailStage === 3) {
    await kv.srem('leads:email2_sent', leadData.email);
  }
}
