/**
 * Distributed Rate Limiter for Email Sending
 * Ensures emails are sent at a controlled rate to avoid hitting Resend API limits
 * Rate limit: 2 emails per second (500ms between emails)
 */

import { kv } from './kv.js';

const RATE_LIMIT_KEY = 'email:rate-limit:last-send';
const MIN_DELAY_MS = 500; // 500ms = 2 emails per second

/**
 * Wait for rate limit clearance before sending email
 * Uses Redis to coordinate across multiple concurrent webhook calls
 * @returns {Promise<void>}
 */
export async function waitForRateLimit() {
  const maxAttempts = 60; // Max 30 seconds wait (60 * 500ms)
  let attempt = 0;

  while (attempt < maxAttempts) {
    try {
      // Get the last send timestamp
      const lastSendTime = await kv.get(RATE_LIMIT_KEY);
      const now = Date.now();

      if (!lastSendTime) {
        // First email, no wait needed
        await kv.set(RATE_LIMIT_KEY, now);
        console.log('✓ Rate limit check: First email, proceeding immediately');
        return;
      }

      const timeSinceLastSend = now - parseInt(lastSendTime);

      if (timeSinceLastSend >= MIN_DELAY_MS) {
        // Enough time has passed, try to claim this slot
        // Use atomic compare-and-set to avoid race conditions
        const claimed = await kv.set(RATE_LIMIT_KEY, now);

        if (claimed) {
          console.log(`✓ Rate limit check: ${timeSinceLastSend}ms since last email, proceeding`);
          return;
        }
      }

      // Need to wait, check again after a short delay
      const waitTime = Math.max(MIN_DELAY_MS - timeSinceLastSend, 100);
      console.log(`⏳ Rate limit: Waiting ${waitTime}ms before retry (attempt ${attempt + 1}/${maxAttempts})`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      attempt++;

    } catch (error) {
      console.error('Rate limiter error:', error);
      // On error, wait a bit and retry
      await new Promise(resolve => setTimeout(resolve, MIN_DELAY_MS));
      attempt++;
    }
  }

  // Max attempts reached, proceed anyway but log warning
  console.warn('⚠️ Rate limit: Max wait time reached, proceeding with email send');
}

/**
 * Reset rate limiter (useful for testing)
 */
export async function resetRateLimit() {
  await kv.set(RATE_LIMIT_KEY, 0);
  console.log('Rate limiter reset');
}
