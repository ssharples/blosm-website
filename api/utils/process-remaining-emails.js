/**
 * Manual endpoint to process remaining queued emails
 * Can be called to finish sending emails that were missed due to timeouts
 */

import { getLeadsByStage, updateLeadStage, shouldSendFollowUp, isUnsubscribed } from './kv.js';
import { sendCampaignEmail } from './resend-campaign.js';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Optional: Add authentication
  const authHeader = req.headers['authorization'];
  if (authHeader !== `Bearer ${process.env.ADMIN_SECRET || 'your-admin-secret'}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { batchSize = 20, testMode = false } = req.body;

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📧 Processing Remaining Emails');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`Batch Size: ${batchSize}`);
  console.log(`Test Mode: ${testMode}`);

  try {
    // Get all queued leads
    const queuedLeads = await getLeadsByStage('queued');
    console.log(`\nFound ${queuedLeads.length} queued leads`);

    if (queuedLeads.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No leads in queue',
        stats: { total: 0, sent: 0, skipped: 0, failed: 0 }
      });
    }

    // Take only the specified batch size
    const leadsToProcess = queuedLeads.slice(0, batchSize);

    const results = {
      total: queuedLeads.length,
      processing: leadsToProcess.length,
      sent: 0,
      skipped: 0,
      failed: 0,
      errors: [],
      processedEmails: []
    };

    // Process each lead
    for (const lead of leadsToProcess) {
      try {
        console.log(`\nProcessing: ${lead.email} (${lead.companyName || 'No Company'})`);

        // Check if unsubscribed
        if (await isUnsubscribed(lead.email)) {
          console.log(`  ⊘ Skipped: Unsubscribed`);
          results.skipped++;
          continue;
        }

        // Validate lead should receive Email 1
        if (!(await shouldSendFollowUp(lead, 1))) {
          console.log(`  ⊘ Skipped: Not eligible for Email 1`);
          results.skipped++;
          continue;
        }

        if (testMode) {
          console.log(`  🧪 TEST MODE: Would send email to ${lead.email}`);
          results.processedEmails.push({
            email: lead.email,
            company: lead.companyName,
            status: 'test_mode'
          });
          results.sent++;
        } else {
          // Actually send Email 1
          console.log(`  → Sending email...`);
          const sendResult = await sendCampaignEmail(lead, 1);

          // Update stage to email1_sent
          await updateLeadStage(lead.email, 'email1_sent', 'queued');

          results.sent++;
          results.processedEmails.push({
            email: lead.email,
            company: lead.companyName,
            status: 'sent',
            resendId: sendResult?.data?.id || sendResult?.id
          });

          console.log(`  ✓ Sent: Email 1 delivered (ID: ${sendResult?.data?.id || sendResult?.id || 'unknown'})`);
        }

        // Add delay to avoid rate limits (100ms between emails)
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        results.failed++;
        results.errors.push({
          email: lead.email,
          company: lead.companyName,
          error: error.message
        });
        console.error(`  ✗ Failed: ${error.message}`);
      }
    }

    const remainingCount = queuedLeads.length - leadsToProcess.length;

    // Summary
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Processing Summary');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Total in Queue:  ${results.total}`);
    console.log(`Processed:       ${results.processing}`);
    console.log(`✓ Sent:          ${results.sent}`);
    console.log(`⊘ Skipped:       ${results.skipped}`);
    console.log(`✗ Failed:        ${results.failed}`);
    console.log(`Remaining:       ${remainingCount}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    res.status(200).json({
      success: true,
      message: testMode
        ? `Test mode: Would process ${results.sent} emails`
        : `Processed ${results.sent} emails successfully`,
      timestamp: new Date().toISOString(),
      stats: results,
      remaining: remainingCount,
      nextBatchUrl: remainingCount > 0
        ? `/api/utils/process-remaining-emails?batchSize=${batchSize}`
        : null
    });

  } catch (error) {
    console.error('❌ Processing Error:', error);

    res.status(500).json({
      error: 'Processing failed',
      message: error.message
    });
  }
}