/**
 * Cron Job: Email 3 - Final Follow-up (Monday 7:50am GMT)
 * Sends the third and final email in the campaign sequence to leads who received Email 2
 * Sends 4 days after Email 2 (Thursday → Monday)
 * Total campaign duration: 8 days
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
  console.log('🕐 Email 3 Cron Job Started (Monday 7:50am GMT)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Timestamp: ${new Date().toISOString()}`);

  try {
    // Get leads who received Email 2
    const leads = await getLeadsByStage('email2_sent');

    console.log(`\nFound ${leads.length} leads with Email 2 sent`);

    if (leads.length === 0) {
      console.log('✓ No leads to process');
      return res.status(200).json({
        success: true,
        message: 'No leads ready for Email 3',
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

        // Check if 4 days have passed since Email 2
        if (!(await shouldSendFollowUp(lead, 3))) {
          const email2Date = new Date(lead.email2_sentAt);
          const daysSince = Math.floor((Date.now() - email2Date.getTime()) / (1000 * 60 * 60 * 24));
          console.log(`  ⊘ Skipped: Only ${daysSince} days since Email 2 (need 4)`);
          results.skipped++;
          continue;
        }

        // Check if Email 3 content exists
        if (!lead.email3Subject || !lead.email3Body) {
          console.log(`  ⊘ Skipped: Email 3 content not configured`);
          // Still mark as completed since campaign sequence is done
          await updateLeadStage(lead.email, 'completed', 'email2_sent');
          results.skipped++;
          continue;
        }

        // Send Email 3 (Final follow-up)
        await sendCampaignEmail(lead, 3);

        // Update stage to completed - campaign finished!
        await updateLeadStage(lead.email, 'completed', 'email2_sent');

        results.sent++;
        console.log(`  ✓ Sent: Email 3 delivered - Campaign complete! 🎉`);

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
    console.log('📊 Email 3 Campaign Summary (Final)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Total Leads:    ${results.total}`);
    console.log(`✓ Sent:         ${results.sent} (Campaigns Completed!)`);
    console.log(`⊘ Skipped:      ${results.skipped}`);
    console.log(`✗ Failed:       ${results.failed}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    res.status(200).json({
      success: true,
      message: 'Email 3 campaign completed - All campaigns finished',
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
