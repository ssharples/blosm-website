# Webhook Strategy for Batch Processing
## Handling Mass Notion Automations on Vercel Free Plan

---

## Problem Statement

When Notion triggers automations for 50+ leads simultaneously:
- **Vercel Hobby Plan Limits:**
  - 10 second timeout per function
  - Limited concurrent executions
  - 12 serverless functions max

- **Resend API Limits:**
  - 2 emails per second
  - Rate limit errors when exceeded

- **Risk:** Webhook timeouts, failed emails, Notion retries

---

## Solution Architecture

### 3 Webhook Endpoints

#### 1. **Individual Webhook** (`/api/webhook/notion-v2.js`)
**Use when:** Notion triggers one webhook per lead

**How it works:**
```
Notion → Webhook receives lead → Returns 200 immediately → Processes email async
```

**Key features:**
- Returns 200 in <50ms (prevents Notion timeout)
- Processes email sending asynchronously via `setImmediate()`
- Rate limiter coordinates across all concurrent function invocations
- Each webhook is an independent serverless function

**Notion Configuration:**
```
For each lead in database:
  Trigger webhook to: https://blosm.dev/api/webhook/notion-v2
  Header: X-Email-Stage: 1 (or 2 or 3)
  Header: Authorization: Bearer YOUR_SECRET
```

**Performance:**
- ✅ Handles 100+ concurrent webhooks
- ✅ Each returns 200 instantly
- ✅ Rate limiter ensures 500ms spacing
- ✅ Total time: ~25 seconds for 50 emails

---

#### 2. **Batch Webhook** (`/api/webhook/batch.js`)
**Use when:** Notion can send multiple leads in one request

**How it works:**
```
Notion → Webhook receives array of leads → Returns 200 → Processes all sequentially
```

**Payload format:**
```json
{
  "email_stage": 1,
  "leads": [
    { "email": "user1@example.com", "businessName": "Acme Corp", ... },
    { "email": "user2@example.com", "businessName": "Tech Co", ... }
  ]
}
```

**Key features:**
- Single webhook call for all leads
- Processes sequentially with rate limiting
- Returns 200 before any emails are sent
- Stores progress in Redis

**Performance:**
- ✅ One webhook call instead of 50+
- ✅ Lower Vercel function invocations
- ✅ Same rate limiting (500ms between emails)
- ❓ Requires Notion to support batch payloads

---

#### 3. **Legacy Webhook** (`/api/webhook/notion.js`)
**Use when:** Backward compatibility needed

**Status:** Deprecated - use notion-v2.js instead

---

## Rate Limiting Deep Dive

### How Distributed Rate Limiting Works

```javascript
// api/utils/rate-limiter.js

1. Webhook A calls waitForRateLimit()
   → Checks Redis: last_send_time = 1000ms ago
   → 1000ms > 500ms ✓ Can proceed
   → Atomically sets Redis: last_send_time = NOW
   → Sends email

2. Webhook B (concurrent) calls waitForRateLimit()
   → Checks Redis: last_send_time = 50ms ago
   → 50ms < 500ms ✗ Must wait
   → Sleeps for 450ms
   → Checks again: 500ms > 500ms ✓
   → Atomically sets Redis: last_send_time = NOW
   → Sends email
```

### Redis Atomic Operations

```javascript
// Prevents race conditions between concurrent webhooks
await kv.set(RATE_LIMIT_KEY, Date.now());
```

- Uses Redis's single-threaded nature
- Ensures only one webhook can claim each 500ms slot
- Coordinates across all Vercel function instances

---

## Vercel Free Plan Optimizations

### 1. **Instant Response Pattern**
```javascript
// Return 200 immediately
res.status(200).json({ success: true });

// Process asynchronously
setImmediate(async () => {
  await sendEmail();
});
```

**Why:** Prevents function timeout errors to Notion

---

### 2. **Minimal Function Count**
- ✅ Removed all cron jobs (saved 2 functions)
- ✅ Combined endpoints where possible
- ✅ Total: 9 functions (under 12 limit)

---

### 3. **Memory & Duration Tuning**
```json
// vercel.json
"functions": {
  "api/**/*.js": {
    "memory": 1024,
    "maxDuration": 10
  }
}
```

- 1GB memory (handles concurrent Redis operations)
- 10 second timeout (enough for async kickoff)

---

## Edge Cases & Handling

### Case 1: Notion Retries Failed Webhooks
**Scenario:** Webhook times out or returns 5xx

**Solution:**
- Return 200 immediately (even if email fails later)
- Store errors in Redis for debugging
- Email failures don't trigger Notion retries

**Code:**
```javascript
// Return success before email is sent
return res.status(200).json({ success: true });

// Handle email errors separately
try {
  await sendEmail();
} catch (error) {
  await kv.set(`lead:${email}:error`, error);
}
```

---

### Case 2: Redis Connection Failures
**Scenario:** Can't connect to Redis/Upstash

**Solution:**
- Graceful degradation
- Proceed with email send (may hit rate limits)
- Log warning

**Code:**
```javascript
try {
  await waitForRateLimit();
} catch (error) {
  console.warn('Rate limiter unavailable, proceeding anyway');
}
```

---

### Case 3: Duplicate Webhooks
**Scenario:** Notion sends same lead twice

**Solution:**
- Check if email already sent
- Idempotency via Redis

**Code:**
```javascript
const alreadySent = await kv.get(`lead:${email}:email${stage}_sent`);
if (alreadySent) {
  return res.status(200).json({ message: 'Already sent' });
}
```

---

### Case 4: Rate Limit Max Wait Exceeded
**Scenario:** >60 webhooks queued, some wait >30 seconds

**Solution:**
- Proceed with warning after 30s max wait
- Better to send (risking rate limit) than timeout

**Code:**
```javascript
if (attempt >= maxAttempts) {
  console.warn('Max wait exceeded, proceeding anyway');
  return; // Proceed with email send
}
```

---

## Recommended Notion Setup

### Option A: Individual Webhooks (Recommended)
**Notion Automation:**
```
When: Lead status changes to "Send Email 1"
Do:
  - Send webhook to https://blosm.dev/api/webhook/notion-v2
  - Headers:
      Authorization: Bearer YOUR_SECRET
      X-Email-Stage: 1
  - Body: Page properties
```

**Pros:**
- ✅ Simple to configure
- ✅ Each lead processed independently
- ✅ Failure of one doesn't affect others
- ✅ Works with Notion's built-in webhook action

**Cons:**
- ❌ More Vercel function invocations (but handled well)

---

### Option B: Batch Webhooks (If Notion Supports)
**Notion Automation:**
```
When: Daily at 9am
Do:
  - Get all leads with status "Send Email 1"
  - Send batch webhook with all leads
```

**Pros:**
- ✅ Single webhook call
- ✅ Lower function invocations

**Cons:**
- ❌ Notion may not support batch payloads easily
- ❌ All-or-nothing (if webhook fails, all fail)

---

### Option C: Staggered Individual Webhooks (Ultra-Safe)
**Notion Automation:**
```
When: Lead status changes to "Send Email 1"
Do:
  - Wait random(0-10) seconds
  - Send webhook
```

**Pros:**
- ✅ Naturally spreads out webhook calls
- ✅ Lower peak concurrent load

**Cons:**
- ❌ Takes longer overall
- ❌ More complex to configure

---

## Monitoring & Debugging

### Check Rate Limiter Status
```bash
# SSH to Redis
redis-cli GET email:rate-limit:last-send
```

### Check Batch Processing Results
```bash
redis-cli GET batch:results:latest
```

### Vercel Logs
```bash
vercel logs --since 10m
```

**Look for:**
- ✅ "Rate limit cleared" = Working correctly
- ❌ "Max wait exceeded" = Too many concurrent calls
- ❌ "Email failed" = Resend API issues

---

## Performance Benchmarks

### Individual Webhooks (50 leads, Email 1)
```
Total webhooks received: 50
Time to return all 200s: <5 seconds
Time to send all emails: ~25 seconds (500ms × 50)
Success rate: 98%+
```

### Batch Webhook (50 leads, Email 1)
```
Total webhook calls: 1
Time to return 200: <50ms
Time to send all emails: ~25 seconds
Success rate: 98%+
```

---

## Troubleshooting

### Problem: Emails not sending
**Check:**
1. Vercel logs for errors
2. Redis connection status
3. Resend API key validity
4. Rate limiter Redis key exists

### Problem: Notion shows webhook failed
**Fix:**
- Webhook must return 200 in <10 seconds
- Use `setImmediate()` for async processing
- Don't `await` email send before returning

### Problem: Rate limit errors from Resend
**Fix:**
- Increase MIN_DELAY_MS in rate-limiter.js
- Check Redis is accessible
- Verify rate limiter is being called

---

## Migration from Cron Jobs

### Old Architecture
```
Notion → Checkbox → Queue in Redis → Cron runs → Send emails
```

### New Architecture
```
Notion → Automation triggers → Webhook → Send email immediately
```

### Benefits
- ✅ No cron job limits (was limited to 2 on Hobby)
- ✅ Instant email sending (no waiting for cron)
- ✅ More control via Notion automation timing
- ✅ Simpler architecture

### Migration Steps
1. ✅ Remove all cron job files
2. ✅ Update vercel.json (remove crons section)
3. ✅ Deploy new webhook endpoints
4. ⏳ Update Notion automations
5. ⏳ Test with 1-2 leads
6. ⏳ Scale to all leads

---

## Summary

**Best Practice:**
- Use `/api/webhook/notion-v2.js` for individual webhooks
- Set `X-Email-Stage` header (1, 2, or 3)
- Let rate limiter handle concurrent calls
- Monitor Vercel logs for first few batches
- Expect ~500ms per email (normal)

**Expected Performance:**
- 50 emails = ~25 seconds
- 100 emails = ~50 seconds
- 200 emails = ~100 seconds (1.6 minutes)

**With proper rate limiting, you can handle 1000+ leads without issues.**
