/**
 * Cron Job: Email 2 - First Follow-up (Thursday 7:50am GMT)
 * Sends the second email in the campaign sequence to leads who received Email 1
 * Sends 3 days after Email 1 (Monday → Thursday)
 */

import { getLeadsByStage, updateLeadStage, shouldSendFollowUp, isUnsubscribed } from '../utils/kv.js';
import { sendCampaignEmail } from '../utils/resend-campaign.js';
import { waitForRateLimit } from '../utils/rate-limiter.js';

export default async function handler(req, res) {
  // Verify this is a cron request from Vercel
  const authHeader = req.headers['authorization'];
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    console.warn('Unauthorized cron attempt');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🕐 Email 2 Cron Job Started (Thursday 7:50am GMT)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Timestamp: ${new Date().toISOString()}`);

  try {
    // Get leads who received Email 1
    const leads = await getLeadsByStage('email1_sent');

    console.log(`\nFound ${leads.length} leads with Email 1 sent`);

    if (leads.length === 0) {
      console.log('✓ No leads to process');
      return res.status(200).json({
        success: true,
        message: 'No leads ready for Email 2',
        stats: { total: 0, sent: 0, skipped: 0, failed: 0 }
      });
    }

    const results = {
      total: leads.length,
      sent: 0,
      skipped: 0,
      failed: 0,
      errors: []
    };

    // Process each lead
    for (const lead of leads) {
      try {
        console.log(`\nProcessing: ${lead.email} (${lead.companyName || 'No Company'})`);

        // Check if unsubscribed
        if (await isUnsubscribed(lead.email)) {
          console.log(`  ⊘ Skipped: Unsubscribed`);
          results.skipped++;
          continue;
        }

        // Check if 3 days have passed since Email 1
        if (!(await shouldSendFollowUp(lead, 2))) {
          const email1Date = new Date(lead.email1_sentAt);
          const daysSince = Math.floor((Date.now() - email1Date.getTime()) / (1000 * 60 * 60 * 24));
          console.log(`  ⊘ Skipped: Only ${daysSince} days since Email 1 (need 3)`);
          results.skipped++;
          continue;
        }

        // Check if Email 2 content exists
        if (!lead.email2Subject || !lead.email2Body) {
          console.log(`  ⊘ Skipped: Email 2 content not configured`);
          results.skipped++;
          continue;
        }

        // Send Email 2
        await waitForRateLimit();
        await sendCampaignEmail(lead, 2);

        // Update stage to email2_sent
        await updateLeadStage(lead.email, 'email2_sent', 'email1_sent');

        results.sent++;
        console.log(`  ✓ Sent: Email 2 delivered`);

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
    console.log('📊 Email 2 Campaign Summary');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Total Leads:    ${results.total}`);
    console.log(`✓ Sent:         ${results.sent}`);
    console.log(`⊘ Skipped:      ${results.skipped}`);
    console.log(`✗ Failed:       ${results.failed}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    res.status(200).json({
      success: true,
      message: 'Email 2 campaign completed',
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
