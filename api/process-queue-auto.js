/**
 * Automatic Queue Processor
 * Processes ALL queued emails until complete or timeout
 * Optimized for Notion scheduled automations
 */

import { kv } from './utils/kv.js';
import { sendCampaignEmail } from './utils/resend-campaign.js';
import { waitForRateLimit } from './utils/rate-limiter.js';

export const config = {
  maxDuration: 10, // 10 second timeout
};

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

  const startTime = Date.now();
  const { emailStage = 1, maxExecutionTime = 8000 } = req.body; // 8 seconds max

  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🔄 Auto Queue Processor: Stage ${emailStage}`);
  console.log(`   Max execution time: ${maxExecutionTime}ms`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

  const results = {
    processed: 0,
    sent: 0,
    failed: 0,
    queueEmpty: false,
    executionTime: 0,
    errors: []
  };

  try {
    const queueKey = `email:queue:stage${emailStage}`;

    // Process queue until empty or timeout
    while (true) {
      // Check timeout
      const elapsed = Date.now() - startTime;
      if (elapsed >= maxExecutionTime) {
        console.log(`⏰ Timeout approaching (${elapsed}ms), stopping batch`);
        break;
      }

      // Get queue size
      const queuedEmails = await kv.smembers(queueKey);

      if (!queuedEmails || queuedEmails.length === 0) {
        console.log(`✅ Queue empty!`);
        results.queueEmpty = true;
        break;
      }

      console.log(`\n📊 Queue status: ${queuedEmails.length} emails remaining`);

      // Process one email
      const email = queuedEmails[0];
      results.processed++;

      try {
        // Get queued email data
        const leadData = await kv.get(`email:queued:${email}:stage${emailStage}`);

        if (!leadData) {
          console.warn(`No data found for queued email: ${email}`);
          await kv.srem(queueKey, email);
          continue;
        }

        // Wait for rate limit (max 3 seconds)
        console.log(`Processing ${email} (${results.processed})...`);
        const canProceed = await waitForRateLimit();

        if (!canProceed) {
          console.log(`Rate limiter timeout, will process on next run`);
          results.processed--; // Don't count this as processed
          break;
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

        // Remove from queue even on failure (to prevent infinite loop)
        // Store error for debugging
        await kv.srem(queueKey, email);
        await kv.set(`email:failed:${email}:stage${emailStage}`, {
          leadData: await kv.get(`email:queued:${email}:stage${emailStage}`),
          error: error.message,
          timestamp: new Date().toISOString()
        });
        await kv.del(`email:queued:${email}:stage${emailStage}`);
      }
    }

    // Check final queue size
    const finalQueue = await kv.smembers(queueKey);
    const remainingCount = finalQueue?.length || 0;

    results.executionTime = Date.now() - startTime;

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`✅ Batch Complete:`);
    console.log(`   Processed: ${results.processed}`);
    console.log(`   Sent: ${results.sent}`);
    console.log(`   Failed: ${results.failed}`);
    console.log(`   Remaining: ${remainingCount}`);
    console.log(`   Time: ${results.executionTime}ms`);
    console.log(`   Queue empty: ${results.queueEmpty ? 'YES' : 'NO'}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    return res.status(200).json({
      success: true,
      stage: emailStage,
      remaining: remainingCount,
      ...results
    });

  } catch (error) {
    console.error('Auto queue processor error:', error);
    results.executionTime = Date.now() - startTime;

    return res.status(500).json({
      error: 'Queue processing failed',
      message: error.message,
      ...results
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
