/**
 * Cron Job: Email 1 - Initial Outreach (Monday 7:50am GMT)
 * BATCHED VERSION - Processes emails in chunks to avoid timeouts
 */

import { kv } from '@vercel/kv';
import { getLeadsByStage, updateLeadStage, shouldSendFollowUp, isUnsubscribed } from '../utils/kv.js';
import { sendCampaignEmail } from '../utils/resend-campaign.js';

const BATCH_SIZE = 50; // Process 50 emails per execution
const BATCH_KEY = 'email-campaign:batch:current';

export default async function handler(req, res) {
  // Verify this is a cron request from Vercel
  const authHeader = req.headers['authorization'];
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    console.warn('Unauthorized cron attempt');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🕐 Email 1 Cron Job Started - BATCHED (Monday 7:50am GMT)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Timestamp: ${new Date().toISOString()}`);

  try {
    // Get current batch index
    let batchIndex = await kv.get(BATCH_KEY) || 0;

    // Get all queued leads
    const allQueuedLeads = await getLeadsByStage('queued');
    console.log(`\n📊 Total queued leads: ${allQueuedLeads.length}`);

    // Calculate batch range
    const startIdx = batchIndex * BATCH_SIZE;
    const endIdx = Math.min(startIdx + BATCH_SIZE, allQueuedLeads.length);
    const batchLeads = allQueuedLeads.slice(startIdx, endIdx);

    console.log(`📦 Processing batch ${batchIndex + 1}:`);
    console.log(`   Range: ${startIdx + 1}-${endIdx} of ${allQueuedLeads.length}`);
    console.log(`   Batch size: ${batchLeads.length} leads`);

    if (batchLeads.length === 0) {
      // Reset batch counter for next run
      await kv.del(BATCH_KEY);
      console.log('✓ All batches processed, resetting counter');

      return res.status(200).json({
        success: true,
        message: 'All batches completed',
        stats: {
          totalQueued: allQueuedLeads.length,
          batchesCompleted: batchIndex,
          allDone: true
        }
      });
    }

    const results = {
      batch: batchIndex + 1,
      totalQueued: allQueuedLeads.length,
      batchSize: batchLeads.length,
      sent: 0,
      skipped: 0,
      failed: 0,
      errors: []
    };

    // Process each lead in this batch
    for (const lead of batchLeads) {
      try {
        console.log(`\n→ Processing: ${lead.email} (${lead.companyName || 'No Company'})`);

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
        console.log(`  → Sending email...`);
        const sendResult = await sendCampaignEmail(lead, 1);

        // Update stage to email1_sent
        await updateLeadStage(lead.email, 'email1_sent', 'queued');

        results.sent++;
        console.log(`  ✓ Sent: Email 1 delivered (ID: ${sendResult?.data?.id || sendResult?.id || 'unknown'})`);

        // Add small delay to avoid rate limits
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

    // Check if more batches remain
    const hasMoreBatches = endIdx < allQueuedLeads.length;

    if (hasMoreBatches) {
      // Increment batch counter for next execution
      await kv.set(BATCH_KEY, batchIndex + 1, { ex: 3600 }); // Expire after 1 hour

      // Schedule next batch immediately (call this endpoint again)
      console.log(`\n🔄 Batch ${batchIndex + 1} complete. ${allQueuedLeads.length - endIdx} leads remaining.`);
      console.log(`   Next batch will process leads ${endIdx + 1}-${Math.min(endIdx + BATCH_SIZE, allQueuedLeads.length)}`);

      // Trigger next batch via internal call (if within same execution)
      if (results.sent > 0 && hasMoreBatches) {
        console.log('   ⏳ Scheduling next batch in 5 seconds...');
        setTimeout(async () => {
          try {
            await fetch(`${process.env.VERCEL_URL || 'https://blosm.dev'}/api/cron/email-1-monday-batched`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${cronSecret}`
              }
            });
          } catch (err) {
            console.error('Failed to trigger next batch:', err);
          }
        }, 5000);
      }
    } else {
      // All batches complete, reset counter
      await kv.del(BATCH_KEY);
      console.log('\n✅ All batches processed successfully!');
    }

    // Summary
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 Email 1 Campaign - Batch ${batchIndex + 1} Summary`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Total in Queue: ${allQueuedLeads.length}`);
    console.log(`Batch Range:    ${startIdx + 1}-${endIdx}`);
    console.log(`✓ Sent:         ${results.sent}`);
    console.log(`⊘ Skipped:      ${results.skipped}`);
    console.log(`✗ Failed:       ${results.failed}`);
    console.log(`Remaining:      ${Math.max(0, allQueuedLeads.length - endIdx)}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    res.status(200).json({
      success: true,
      message: hasMoreBatches ? `Batch ${batchIndex + 1} completed, more batches remain` : 'All batches completed',
      timestamp: new Date().toISOString(),
      stats: results,
      hasMore: hasMoreBatches
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