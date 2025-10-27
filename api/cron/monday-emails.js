/**
 * Combined Monday Email Processor
 * Sends both Email 1 (initial) and Email 3 (final follow-up) on Mondays
 * Runs at 7:50am GMT every Monday
 */

import { kv } from '../utils/kv.js';
import { sendCampaignEmail } from '../utils/resend-campaign.js';

export const config = {
  maxDuration: 60, // 60 seconds timeout for Pro plan
};

export default async function handler(req, res) {
  // Verify cron secret
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    console.error('Unauthorized cron attempt');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('MONDAY EMAIL PROCESSOR');
  console.log('Processing both Email 1 and Email 3');
  console.log('Time:', new Date().toISOString());
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    // Process Email 1 (Initial outreach)
    console.log('\n📧 Processing Email 1 (Initial Outreach)...');
    const email1Results = await processEmail1();

    // Process Email 3 (Final follow-up)
    console.log('\n📧 Processing Email 3 (Final Follow-up)...');
    const email3Results = await processEmail3();

    // Combined summary
    const summary = {
      timestamp: new Date().toISOString(),
      email1: email1Results,
      email3: email3Results,
      totalProcessed: email1Results.processed + email3Results.processed,
      totalSent: email1Results.sent + email3Results.sent,
      totalErrors: email1Results.errors + email3Results.errors
    };

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('MONDAY EMAIL PROCESSOR COMPLETE');
    console.log(`Total Processed: ${summary.totalProcessed}`);
    console.log(`Total Sent: ${summary.totalSent}`);
    console.log(`Total Errors: ${summary.totalErrors}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    res.status(200).json({
      success: true,
      message: 'Monday emails processed successfully',
      ...summary
    });

  } catch (error) {
    console.error('Monday email processor error:', error);
    res.status(500).json({
      error: 'Failed to process Monday emails',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

/**
 * Process Email 1 - Initial outreach to queued leads
 */
async function processEmail1() {
  const results = {
    processed: 0,
    sent: 0,
    errors: 0,
    details: []
  };

  try {
    // Get all queued leads
    const queuedEmails = await kv.smembers('leads:queued');

    if (!queuedEmails || queuedEmails.length === 0) {
      console.log('No queued leads found for Email 1');
      return results;
    }

    console.log(`Found ${queuedEmails.length} queued leads`);

    // Process each lead
    for (const email of queuedEmails) {
      results.processed++;

      try {
        // Retrieve full lead data
        const leadData = await kv.get(`lead:${email}`);

        if (!leadData) {
          console.warn(`Lead data not found for ${email}`);
          results.errors++;
          continue;
        }

        // Send Email 1
        console.log(`Sending Email 1 to ${email}...`);
        const emailResult = await sendCampaignEmail(leadData, 1);

        if (emailResult?.data?.id || emailResult?.id) {
          results.sent++;
          console.log(`✓ Email 1 sent to ${email}`);

          // Update lead status
          leadData.status = 'email1_sent';
          leadData.email1SentAt = new Date().toISOString();
          leadData.lastUpdated = new Date().toISOString();

          await kv.set(`lead:${email}`, leadData);
          await kv.sadd('leads:email1_sent', email);
          await kv.srem('leads:queued', email);

          results.details.push({
            email,
            stage: 1,
            status: 'sent',
            resendId: emailResult?.data?.id || emailResult?.id
          });
        } else {
          throw new Error('No email ID returned from Resend');
        }

        // Small delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`Failed to send Email 1 to ${email}:`, error.message);
        results.errors++;
        results.details.push({
          email,
          stage: 1,
          status: 'error',
          error: error.message
        });
      }
    }
  } catch (error) {
    console.error('Error processing Email 1:', error);
  }

  return results;
}

/**
 * Process Email 3 - Final follow-up to leads that received Email 2
 */
async function processEmail3() {
  const results = {
    processed: 0,
    sent: 0,
    errors: 0,
    details: []
  };

  try {
    // Get leads that have received Email 2
    const email2SentLeads = await kv.smembers('leads:email2_sent');

    if (!email2SentLeads || email2SentLeads.length === 0) {
      console.log('No leads ready for Email 3');
      return results;
    }

    console.log(`Found ${email2SentLeads.length} leads ready for Email 3`);

    // Process each lead
    for (const email of email2SentLeads) {
      results.processed++;

      try {
        // Retrieve full lead data
        const leadData = await kv.get(`lead:${email}`);

        if (!leadData) {
          console.warn(`Lead data not found for ${email}`);
          results.errors++;
          continue;
        }

        // Skip if no Email 3 content
        if (!leadData.email3Subject || !leadData.email3Body) {
          console.log(`No Email 3 content for ${email}, marking as completed`);

          // Update status to completed
          leadData.status = 'completed';
          leadData.completedAt = new Date().toISOString();
          leadData.lastUpdated = new Date().toISOString();

          await kv.set(`lead:${email}`, leadData);
          await kv.sadd('leads:completed', email);
          await kv.srem('leads:email2_sent', email);

          continue;
        }

        // Send Email 3
        console.log(`Sending Email 3 to ${email}...`);
        const emailResult = await sendCampaignEmail(leadData, 3);

        if (emailResult?.data?.id || emailResult?.id) {
          results.sent++;
          console.log(`✓ Email 3 sent to ${email}`);

          // Update lead status to completed
          leadData.status = 'completed';
          leadData.email3SentAt = new Date().toISOString();
          leadData.completedAt = new Date().toISOString();
          leadData.lastUpdated = new Date().toISOString();

          await kv.set(`lead:${email}`, leadData);
          await kv.sadd('leads:completed', email);
          await kv.srem('leads:email2_sent', email);

          results.details.push({
            email,
            stage: 3,
            status: 'sent',
            resendId: emailResult?.data?.id || emailResult?.id
          });
        } else {
          throw new Error('No email ID returned from Resend');
        }

        // Small delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`Failed to send Email 3 to ${email}:`, error.message);
        results.errors++;
        results.details.push({
          email,
          stage: 3,
          status: 'error',
          error: error.message
        });
      }
    }
  } catch (error) {
    console.error('Error processing Email 3:', error);
  }

  return results;
}