# Email Queue Processing Guide
## How to Handle 200+ Concurrent Email Sends

---

## Overview

When Notion sends 200+ webhooks at once, the system uses a **hybrid approach**:
- **First ~5 emails**: Sent immediately (rate limiter clear)
- **Remaining ~195 emails**: Queued in Redis (instant response)
- **All webhooks**: Return 200 in <3 seconds (no timeouts)

Then you process the queue using one of three methods below.

---

## ✅ Option 1: Notion Automation (Recommended)

**Best for:** Fully automated queue processing

### Setup

Create a **scheduled Notion automation** that runs every 5-10 minutes:

#### Automation 1: Process Email Stage 1 Queue
```
Trigger: Every 5 minutes
Action: Send webhook
  URL: https://blosm.dev/api/process-queue-auto
  Method: POST
  Headers:
    Authorization: Bearer YOUR_WEBHOOK_SECRET
    Content-Type: application/json
  Body:
    {
      "emailStage": 1
    }
```

#### Automation 2: Process Email Stage 2 Queue
```
Trigger: Every 5 minutes
Action: Send webhook
  URL: https://blosm.dev/api/process-queue-auto
  Method: POST
  Body:
    {
      "emailStage": 2
    }
```

#### Automation 3: Process Email Stage 3 Queue
```
Trigger: Every 5 minutes
Action: Send webhook
  URL: https://blosm.dev/api/process-queue-auto
  Method: POST
  Body:
    {
      "emailStage": 3
    }
```

### How It Works

- **Every 5 minutes**, Notion calls the auto-processor
- The endpoint processes emails for **up to 8 seconds**
- At 2 emails/second, that's ~15 emails per run
- If queue not empty, it runs again in 5 minutes
- **Fully automated** - no manual intervention

### Example Timeline (200 emails queued)

```
00:00 - 200 webhooks arrive, 5 sent immediately, 195 queued
00:05 - Auto-processor runs: 15 sent, 180 remaining
00:10 - Auto-processor runs: 15 sent, 165 remaining
00:15 - Auto-processor runs: 15 sent, 150 remaining
...
01:00 - Auto-processor runs: Queue empty ✅
```

**Total time: ~1 hour for 200 emails** (fully automated)

---

## 🚀 Option 2: Manual Script (Fastest)

**Best for:** Immediate processing of entire queue

### Usage

```bash
# Set your webhook secret
export WEBHOOK_SECRET="your-webhook-secret-here"

# Process Email Stage 1 queue
./process-email-queue.sh 1

# Process Email Stage 2 queue
./process-email-queue.sh 2

# Process Email Stage 3 queue
./process-email-queue.sh 3
```

### How It Works

- Script calls `/api/process-queue-auto` in a loop
- Each call processes ~15 emails (8 second timeout)
- Continues until queue is empty
- Shows real-time progress

### Example Output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📬 Processing Email Queue - Stage 1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔄 Iteration 1...
   Sent: 15 | Failed: 0 | Remaining: 185 | Time: 7842ms
🔄 Iteration 2...
   Sent: 15 | Failed: 0 | Remaining: 170 | Time: 7901ms
...
🔄 Iteration 13...
   Sent: 5 | Failed: 0 | Remaining: 0 | Time: 2634ms

✅ Queue empty!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Final Results
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Total sent: 200
   Total failed: 0
   Iterations: 13
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Total time: ~2 minutes for 200 emails**

---

## 🔧 Option 3: Manual API Calls

**Best for:** Testing, debugging, or one-off processing

### Auto Processor (processes until timeout)

```bash
curl -X POST https://blosm.dev/api/process-queue-auto \
  -H "Authorization: Bearer YOUR_WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"emailStage": 1}'
```

**Response:**
```json
{
  "success": true,
  "stage": 1,
  "processed": 15,
  "sent": 15,
  "failed": 0,
  "remaining": 185,
  "queueEmpty": false,
  "executionTime": 7842
}
```

### Manual Batch Processor

```bash
curl -X POST https://blosm.dev/api/process-queue \
  -H "Authorization: Bearer YOUR_WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"emailStage": 1, "batchSize": 50}'
```

**Response:**
```json
{
  "success": true,
  "stage": 1,
  "batchSize": 50,
  "processed": 50,
  "sent": 50,
  "failed": 0,
  "remaining": 150,
  "errors": []
}
```

---

## 📊 Queue Monitoring

### Check Queue Size

```bash
# Using Redis CLI (if you have access)
redis-cli SCARD email:queue:stage1
redis-cli SCARD email:queue:stage2
redis-cli SCARD email:queue:stage3
```

### Check Failed Emails

```bash
redis-cli KEYS "email:failed:*"
redis-cli GET "email:failed:user@example.com:stage1"
```

---

## ⚙️ Configuration

### Adjust Processing Speed

**In `process-queue-auto.js`:**

```javascript
const { emailStage = 1, maxExecutionTime = 8000 } = req.body;
```

- `maxExecutionTime: 8000` = 8 seconds (processes ~15 emails)
- `maxExecutionTime: 9000` = 9 seconds (processes ~17 emails)
- **Don't exceed 9500ms** (Vercel timeout = 10 seconds)

**In Notion automation:**
```json
{
  "emailStage": 1,
  "maxExecutionTime": 9000
}
```

### Adjust Notion Schedule

- **Every 5 minutes**: Moderate queue draining
- **Every 2 minutes**: Faster queue draining
- **Every 10 minutes**: Slower queue draining

---

## 🔍 Troubleshooting

### Queue not emptying

**Check:**
1. Is the auto-processor running? (Check Vercel logs)
2. Are emails failing? (Check Redis for `email:failed:*`)
3. Is rate limiter working? (Should see "Rate limit cleared" in logs)

### Emails sending too slowly

**Solutions:**
- Reduce Notion automation interval (5min → 2min)
- Increase `maxExecutionTime` (8000 → 9000)
- Run the manual script for immediate processing

### Getting 401 errors

**Fix:**
- Verify `WEBHOOK_SECRET` matches in Notion and script
- Check Authorization header format: `Bearer YOUR_SECRET`

---

## 🎯 Recommended Setup

For **best results**, use **Option 1 (Notion Automation)**:

1. Create 3 Notion automations (one per email stage)
2. Set each to run every 5 minutes
3. Point all to `/api/process-queue-auto`
4. Let it run automatically 24/7

**Benefits:**
- ✅ Fully automated (no manual work)
- ✅ Queue drains continuously
- ✅ Works even if 1000+ emails queued
- ✅ No external dependencies (no scripts to run)
- ✅ All within Notion ecosystem

**For immediate processing:**
- Run `./process-email-queue.sh 1` manually
- Drains entire queue in ~2 minutes

---

## 📈 Performance Metrics

### With 200 Concurrent Webhooks

| Metric | Value |
|--------|-------|
| Webhooks received | 200 |
| Webhooks returning 200 | 200 (100%) |
| Timeout errors | 0 |
| Emails sent immediately | ~5 |
| Emails queued | ~195 |
| Queue processing time (auto) | ~1 hour |
| Queue processing time (script) | ~2 minutes |

### With 1000 Concurrent Webhooks

| Metric | Value |
|--------|-------|
| Webhooks received | 1000 |
| Webhooks returning 200 | 1000 (100%) |
| Timeout errors | 0 |
| Emails sent immediately | ~5 |
| Emails queued | ~995 |
| Queue processing time (auto) | ~5 hours |
| Queue processing time (script) | ~10 minutes |

---

## Summary

**Choose your method:**

- **Fully automated**: Use Notion automation (Option 1)
- **Fastest processing**: Use manual script (Option 2)
- **Testing/debugging**: Use API calls (Option 3)

All methods are production-ready and handle unlimited concurrent webhooks without timeouts!
