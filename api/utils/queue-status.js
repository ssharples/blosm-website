import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Fetching email queue status...');

    // Get all keys that start with 'campaign:'
    const keys = await kv.keys('campaign:*');

    // Initialize counters
    const stats = {
      total: keys.length,
      queued: 0,
      email1_sent: 0,
      email2_sent: 0,
      email3_sent: 0,
      completed: 0,
      failed: 0,
      unknown: 0,
      leads: []
    };

    // Get details for each lead
    for (const key of keys) {
      const leadData = await kv.get(key);

      if (leadData) {
        // Count by status
        switch (leadData.status) {
          case 'queued':
            stats.queued++;
            break;
          case 'email1_sent':
            stats.email1_sent++;
            break;
          case 'email2_sent':
            stats.email2_sent++;
            break;
          case 'email3_sent':
          case 'completed':
            stats.completed++;
            break;
          case 'failed':
            stats.failed++;
            break;
          default:
            stats.unknown++;
        }

        // Add lead summary (only include first 10 for readability)
        if (stats.leads.length < 10) {
          stats.leads.push({
            email: leadData.email,
            company: leadData.companyName,
            status: leadData.status,
            queuedAt: leadData.queuedAt,
            lastUpdated: leadData.lastUpdated || leadData.queuedAt
          });
        }
      }
    }

    // Calculate additional stats
    stats.readyForEmail1 = stats.queued;
    stats.readyForEmail2 = stats.email1_sent;
    stats.readyForEmail3 = stats.email2_sent;
    stats.totalActive = stats.queued + stats.email1_sent + stats.email2_sent;

    // Add timestamp
    stats.checkedAt = new Date().toISOString();

    console.log('Queue status:', stats);

    return res.status(200).json({
      success: true,
      stats,
      message: stats.total > 0
        ? `${stats.total} leads in system, ${stats.totalActive} active in campaign`
        : 'No leads in queue'
    });

  } catch (error) {
    console.error('Error checking queue status:', error);
    return res.status(500).json({
      error: 'Failed to check queue status',
      details: error.message
    });
  }
}