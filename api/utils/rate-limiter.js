/**
 * Distributed Rate Limiter for Email Sending
 * Ensures emails are sent at a controlled rate to avoid hitting Resend API limits
 * Rate limit: 2 emails per second (500ms between emails)
 */

import { kv } from './kv.js';

const RATE_LIMIT_KEY = 'email:rate-limit:last-send';
const MIN_DELAY_MS = 500; // 500ms = 2 emails per second
const MAX_WAIT_MS = 3000; // Max 3 seconds wait before queueing

/**
 * Check if we can send immediately without waiting
 * @returns {Promise<boolean>} true if can send now, false if should queue
 */
export async function canSendImmediately() {
  try {
    const lastSendTime = await kv.get(RATE_LIMIT_KEY);

    if (!lastSendTime) {
      return true; // No previous send, can proceed
    }

    const now = Date.now();
    const timeSinceLastSend = now - parseInt(lastSendTime);

    return timeSinceLastSend >= MIN_DELAY_MS;
  } catch (error) {
    console.error('Rate limit check error:', error);
    return false; // On error, queue it to be safe
  }
}

/**
 * Wait for rate limit clearance before sending email
 * Returns false if should be queued instead of waiting
 * @returns {Promise<boolean>} true if can proceed, false if should queue
 */
export async function waitForRateLimit() {
  const startTime = Date.now();
  let attempt = 0;
  const maxAttempts = 6; // Max 3 seconds wait (6 * 500ms)

  while (attempt < maxAttempts) {
    try {
      // Get the last send timestamp
      const lastSendTime = await kv.get(RATE_LIMIT_KEY);
      const now = Date.now();

      if (!lastSendTime) {
        // First email, no wait needed
        await kv.set(RATE_LIMIT_KEY, now);
        console.log('✓ Rate limit check: First email, proceeding immediately');
        return true;
      }

      const timeSinceLastSend = now - parseInt(lastSendTime);

      if (timeSinceLastSend >= MIN_DELAY_MS) {
        // Enough time has passed, try to claim this slot
        await kv.set(RATE_LIMIT_KEY, now);
        console.log(`✓ Rate limit check: ${timeSinceLastSend}ms since last email, proceeding`);
        return true;
      }

      // Check if we've been waiting too long
      const totalWaitTime = Date.now() - startTime;
      if (totalWaitTime >= MAX_WAIT_MS) {
        console.warn(`⚠️ Rate limit: Waited ${totalWaitTime}ms, should queue instead`);
        return false; // Signal that this should be queued
      }

      // Need to wait, check again after a short delay
      const waitTime = Math.max(MIN_DELAY_MS - timeSinceLastSend, 100);
      console.log(`⏳ Rate limit: Waiting ${waitTime}ms before retry (attempt ${attempt + 1}/${maxAttempts})`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      attempt++;

    } catch (error) {
      console.error('Rate limiter error:', error);
      return false; // On error, queue it
    }
  }

  // Max attempts reached, should queue
  console.warn('⚠️ Rate limit: Max wait time reached, should queue');
  return false;
}

/**
 * Reset rate limiter (useful for testing)
 */
export async function resetRateLimit() {
  await kv.set(RATE_LIMIT_KEY, 0);
  console.log('Rate limiter reset');
}
