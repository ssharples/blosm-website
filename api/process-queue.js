/**
 * Email Queue Processor
 * Processes queued emails at a controlled rate
 * Call this endpoint manually or via external cron to process backlog
 */

import { kv } from './utils/kv.js';
import { sendCampaignEmail } from './utils/resend-campaign.js';
import { waitForRateLimit } from './utils/rate-limiter.js';

export default async function handler(req, res) {
  // Verify authentication
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  const token = authHeader?.replace(/^Bearer\s+/i, '').trim();

  if (token !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { batchSize = 10, emailStage = 1 } = req.body;

  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📬 Queue Processor: Processing up to ${batchSize} emails for stage ${emailStage}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

  try {
    const results = await processQueue(emailStage, batchSize);

    return res.status(200).json({
      success: true,
      stage: emailStage,
      batchSize,
      ...results
    });

  } catch (error) {
    console.error('Queue processing error:', error);
    return res.status(500).json({
      error: 'Queue processing failed',
      message: error.message
    });
  }
}

/**
 * Process queued emails for a specific stage
 */
async function processQueue(emailStage, batchSize) {
  const queueKey = `email:queue:stage${emailStage}`;
  const results = {
    processed: 0,
    sent: 0,
    failed: 0,
    remaining: 0,
    errors: []
  };

  try {
    // Get queued emails
    const queuedEmails = await kv.smembers(queueKey);

    if (!queuedEmails || queuedEmails.length === 0) {
      console.log('No emails in queue');
      return results;
    }

    console.log(`Found ${queuedEmails.length} emails in queue`);

    // Process up to batchSize emails
    const emailsToProcess = queuedEmails.slice(0, batchSize);
    results.remaining = Math.max(0, queuedEmails.length - batchSize);

    for (const email of emailsToProcess) {
      results.processed++;

      try {
        // Get queued email data
        const leadData = await kv.get(`email:queued:${email}:stage${emailStage}`);

        if (!leadData) {
          console.warn(`No data found for queued email: ${email}`);
          await kv.srem(queueKey, email);
          continue;
        }

        // Wait for rate limit
        console.log(`\nProcessing ${email} (${results.processed}/${emailsToProcess.length})...`);
        const canProceed = await waitForRateLimit();

        if (!canProceed) {
          console.log(`Rate limiter still busy, stopping batch at ${results.processed}/${emailsToProcess.length}`);
          break; // Stop processing this batch
        }

        // Send the email
        const emailResult = await sendCampaignEmail(leadData, emailStage);

        if (emailResult?.data?.id || emailResult?.id) {
          results.sent++;
          console.log(`✓ Email ${emailStage} sent to ${email}`);

          // Update lead status
          await updateLeadStatus(leadData, emailStage, emailResult?.data?.id || emailResult?.id);

          // Remove from queue
          await kv.srem(queueKey, email);
          await kv.del(`email:queued:${email}:stage${emailStage}`);
        } else {
          throw new Error('No email ID returned from Resend');
        }

      } catch (error) {
        results.failed++;
        results.errors.push({
          email,
          error: error.message
        });
        console.error(`✗ Failed to send to ${email}:`, error.message);

        // Keep in queue for retry (don't remove on failure)
      }
    }

    console.log(`\n✅ Batch processing complete:`);
    console.log(`   Processed: ${results.processed}`);
    console.log(`   Sent: ${results.sent}`);
    console.log(`   Failed: ${results.failed}`);
    console.log(`   Remaining in queue: ${results.remaining}`);

  } catch (error) {
    console.error('Error processing queue:', error);
    throw error;
  }

  return results;
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
