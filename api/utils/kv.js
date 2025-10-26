/**
 * Vercel KV Helper Functions for Email Campaign Management
 * Handles lead storage, stage tracking, and campaign state management
 */

import { kv } from '@vercel/kv';

/**
 * Store lead in KV with campaign stage
 * @param {Object} lead - Lead data from Notion
 * @returns {Promise<boolean>}
 */
export async function storeLead(lead) {
  const key = `lead:${lead.email}`;

  await kv.set(key, {
    ...lead,
    stage: 'queued',
    scheduledAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  // Add to queued index
  await kv.sadd('leads:queued', lead.email);

  console.log(`Lead stored: ${lead.email} (${lead.companyName})`);
  return true;
}

/**
 * Get leads by stage
 * @param {string} stage - Campaign stage (queued, email1_sent, email2_sent, completed, unsubscribed)
 * @returns {Promise<Array>}
 */
export async function getLeadsByStage(stage) {
  const emails = await kv.smembers(`leads:${stage}`);

  const leads = await Promise.all(
    emails.map(email => kv.get(`lead:${email}`))
  );

  return leads.filter(Boolean);
}

/**
 * Update lead stage
 * @param {string} email - Lead email
 * @param {string} newStage - New campaign stage
 * @param {string} oldStage - Current stage
 * @returns {Promise<boolean>}
 */
export async function updateLeadStage(email, newStage, oldStage) {
  const key = `lead:${email}`;
  const lead = await kv.get(key);

  if (!lead) {
    console.error(`Lead not found: ${email}`);
    return false;
  }

  // Update lead data
  await kv.set(key, {
    ...lead,
    stage: newStage,
    [`${newStage}At`]: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  // Move between stage sets
  await kv.srem(`leads:${oldStage}`, email);
  await kv.sadd(`leads:${newStage}`, email);

  console.log(`Lead stage updated: ${email} (${oldStage} → ${newStage})`);
  return true;
}

/**
 * Check if lead should receive follow-up email
 * @param {Object} lead - Lead data
 * @param {number} emailNumber - Email number (1, 2, or 3)
 * @returns {Promise<boolean>}
 */
export async function shouldSendFollowUp(lead, emailNumber) {
  const now = new Date();

  if (emailNumber === 1) {
    // Send Email 1 if queued
    return lead.stage === 'queued';
  }

  if (emailNumber === 2) {
    // Send Email 2 if Email 1 was sent 3 days ago (Thursday)
    if (lead.stage !== 'email1_sent') return false;

    const email1Date = new Date(lead.email1_sentAt);
    const daysSince = Math.floor((now - email1Date) / (1000 * 60 * 60 * 24));

    // Allow sending on Thursday (3 days after Monday)
    return daysSince >= 3 && daysSince < 4;
  }

  if (emailNumber === 3) {
    // Send Email 3 if Email 2 was sent 4 days ago (next Monday)
    if (lead.stage !== 'email2_sent') return false;

    const email2Date = new Date(lead.email2_sentAt);
    const daysSince = Math.floor((now - email2Date) / (1000 * 60 * 60 * 24));

    // Allow sending on Monday (4 days after Thursday)
    return daysSince >= 4 && daysSince < 5;
  }

  return false;
}

/**
 * Mark lead as unsubscribed
 * @param {string} email - Lead email
 * @returns {Promise<boolean>}
 */
export async function unsubscribeLead(email) {
  const key = `lead:${email}`;
  const lead = await kv.get(key);

  if (!lead) {
    console.error(`Lead not found for unsubscribe: ${email}`);
    return false;
  }

  const oldStage = lead.stage;

  await kv.set(key, {
    ...lead,
    stage: 'unsubscribed',
    unsubscribedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  // Remove from old stage and add to unsubscribed
  await kv.srem(`leads:${oldStage}`, email);
  await kv.sadd('leads:unsubscribed', email);

  console.log(`Lead unsubscribed: ${email}`);
  return true;
}

/**
 * Get lead by email
 * @param {string} email - Lead email
 * @returns {Promise<Object|null>}
 */
export async function getLead(email) {
  const key = `lead:${email}`;
  return await kv.get(key);
}

/**
 * Check if lead is unsubscribed
 * @param {string} email - Lead email
 * @returns {Promise<boolean>}
 */
export async function isUnsubscribed(email) {
  const lead = await getLead(email);
  return lead?.stage === 'unsubscribed';
}

/**
 * Get campaign statistics
 * @returns {Promise<Object>}
 */
export async function getCampaignStats() {
  const stages = ['queued', 'email1_sent', 'email2_sent', 'completed', 'unsubscribed'];

  const stats = {};
  for (const stage of stages) {
    const count = await kv.scard(`leads:${stage}`);
    stats[stage] = count;
  }

  stats.total = Object.values(stats).reduce((sum, count) => sum + count, 0);

  return stats;
}
