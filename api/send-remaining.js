/**
 * Simple endpoint to send remaining queued emails
 * Accessible at /api/send-remaining
 */

import { getLeadsByStage, updateLeadStage, shouldSendFollowUp, isUnsubscribed } from './utils/kv.js';
import { sendCampaignEmail } from './utils/resend-campaign.js';

export default async function handler(req, res) {
  // Simple auth check
  const authHeader = req.headers['authorization'];
  const expectedToken = 'a5f6eec9fa6383069d9f4b07c9271fa999346ba5e974fb4734516eb3e211359a';

  if (authHeader !== `Bearer ${expectedToken}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const batchSize = parseInt(req.query.batch) || 20;

  try {
    // Get queued leads
    const queuedLeads = await getLeadsByStage('queued');
    const leadsToProcess = queuedLeads.slice(0, batchSize);

    const results = {
      total: queuedLeads.length,
      processing: leadsToProcess.length,
      sent: 0,
      failed: 0
    };

    // Process each lead
    for (const lead of leadsToProcess) {
      try {
        // Check if unsubscribed
        if (await isUnsubscribed(lead.email)) {
          continue;
        }

        // Send Email 1
        await sendCampaignEmail(lead, 1);
        await updateLeadStage(lead.email, 'email1_sent', 'queued');
        results.sent++;

        // Small delay
        await new Promise(r => setTimeout(r, 100));

      } catch (error) {
        results.failed++;
        console.error(`Failed to send to ${lead.email}:`, error.message);
      }
    }

    res.status(200).json({
      success: true,
      stats: results,
      remaining: queuedLeads.length - leadsToProcess.length
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to process emails',
      message: error.message
    });
  }
}