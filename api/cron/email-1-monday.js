/**
 * Cron Job: Email 1 - Initial Outreach (Monday 7:50am GMT)
 * Sends the first email in the campaign sequence to all queued leads
 */

import { getLeadsByStage, updateLeadStage, shouldSendFollowUp, isUnsubscribed } from '../utils/kv.js';
import { sendCampaignEmail } from '../utils/resend-campaign.js';

export default async function handler(req, res) {
  // Verify this is a cron request from Vercel
  const authHeader = req.headers['authorization'];
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    console.warn('Unauthorized cron attempt');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🕐 Email 1 Cron Job Started (Monday 7:50am GMT)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Timestamp: ${new Date().toISOString()}`);

  try {
    // Get all queued leads
    const queuedLeads = await getLeadsByStage('queued');

    console.log(`\nFound ${queuedLeads.length} queued leads`);

    if (queuedLeads.length === 0) {
      console.log('✓ No leads to process');
      return res.status(200).json({
        success: true,
        message: 'No leads in queue',
        stats: { total: 0, sent: 0, skipped: 0, failed: 0 }
      });
    }

    const results = {
      total: queuedLeads.length,
      sent: 0,
      skipped: 0,
      failed: 0,
      errors: []
    };

    // Process each lead
    for (const lead of queuedLeads) {
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

        // Send Email 1
        await sendCampaignEmail(lead, 1);

        // Update stage to email1_sent
        await updateLeadStage(lead.email, 'email1_sent', 'queued');

        results.sent++;
        console.log(`  ✓ Sent: Email 1 delivered`);

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

    // Summary
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Email 1 Campaign Summary');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Total Leads:    ${results.total}`);
    console.log(`✓ Sent:         ${results.sent}`);
    console.log(`⊘ Skipped:      ${results.skipped}`);
    console.log(`✗ Failed:       ${results.failed}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    res.status(200).json({
      success: true,
      message: 'Email 1 campaign completed',
      timestamp: new Date().toISOString(),
      stats: results
    });

  } catch (error) {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ Cron Job Error:', error);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    res.status(500).json({
      error: 'Cron job failed',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
