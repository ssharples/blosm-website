# Webhook Testing Guide
## How to Test the New Multi-Stage Webhook System

---

## ✅ Deployment Status

**Deployed:** Yes (production)
**Endpoints:**
- `/api/webhook/notion-v2` - Individual lead webhooks
- `/api/webhook/batch` - Batch processing (multiple leads)

---

## Testing Individual Webhook

### Test Email 1 (Initial Outreach)

```bash
curl -X POST https://blosm.dev/api/webhook/notion-v2 \
  -H "Authorization: Bearer YOUR_WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  -H "X-Email-Stage: 1" \
  -d '{
    "data": {
      "id": "test-page-123",
      "properties": {
        "Business Name": {
          "title": [{"plain_text": "Test Company"}]
        },
        "Email": {
          "email": "test@example.com"
        },
        "Contact Name": {
          "rich_text": [{"plain_text": "John Doe"}]
        },
        "Email 1 Subject": {
          "rich_text": [{"plain_text": "Test Subject"}]
        },
        "Email 1 Body": {
          "rich_text": [{"plain_text": "Test email body content"}]
        }
      }
    }
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Email 1 queued for test@example.com",
  "email": "test@example.com",
  "stage": 1,
  "processingTime": "45ms"
}
```

---

### Test Email 2 (First Follow-up)

```bash
curl -X POST https://blosm.dev/api/webhook/notion-v2 \
  -H "Authorization: Bearer YOUR_WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  -H "X-Email-Stage: 2" \
  -d '{...same payload...}'
```

---

### Test Email 3 (Final Follow-up)

```bash
curl -X POST https://blosm.dev/api/webhook/notion-v2 \
  -H "Authorization: Bearer YOUR_WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  -H "X-Email-Stage: 3" \
  -d '{...same payload...}'
```

---

## Testing Batch Webhook

### Send Multiple Leads at Once

```bash
curl -X POST https://blosm.dev/api/webhook/batch \
  -H "Authorization: Bearer YOUR_WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "email_stage": 1,
    "leads": [
      {
        "email": "user1@example.com",
        "businessName": "Company 1",
        "contactName": "John Doe",
        "email1Subject": "Subject 1",
        "email1Body": "Body 1"
      },
      {
        "email": "user2@example.com",
        "businessName": "Company 2",
        "contactName": "Jane Smith",
        "email1Subject": "Subject 2",
        "email1Body": "Body 2"
      }
    ]
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "2 leads queued for Email 1",
  "total": 2,
  "stage": 1,
  "processingTime": "32ms"
}
```

---

## Notion Automation Setup

### Step 1: Create Automation for Email 1

**Trigger:**
```
When: Database property "Send Email 1" is checked
```

**Action:**
```
Send webhook to: https://blosm.dev/api/webhook/notion-v2
Method: POST
Headers:
  - Authorization: Bearer YOUR_WEBHOOK_SECRET
  - X-Email-Stage: 1
  - Content-Type: application/json

Body:
  Use Notion's default webhook body (includes page data)
```

---

### Step 2: Create Automation for Email 2

**Trigger:**
```
When: Database property "Send Email 2" is checked
OR
When: 3 days after "Send Email 1" was checked
```

**Action:**
```
Send webhook to: https://blosm.dev/api/webhook/notion-v2
Headers:
  - Authorization: Bearer YOUR_WEBHOOK_SECRET
  - X-Email-Stage: 2
```

---

### Step 3: Create Automation for Email 3

**Trigger:**
```
When: Database property "Send Email 3" is checked
OR
When: 7 days after "Send Email 1" was checked
```

**Action:**
```
Send webhook to: https://blosm.dev/api/webhook/notion-v2
Headers:
  - Authorization: Bearer YOUR_WEBHOOK_SECRET
  - X-Email-Stage: 3
```

---

## Monitoring

### Check Vercel Logs
```bash
vercel logs --since 10m
```

**Look for:**
- ✅ `📧 Notion Webhook: Email 1`
- ✅ `✓ Rate limit cleared`
- ✅ `✅ Email 1 sent successfully!`
- ✅ `Resend ID: re_xxxxx`

---

### Check Redis Status

**Rate limiter:**
```bash
redis-cli GET email:rate-limit:last-send
# Should return timestamp of last email sent
```

**Lead status:**
```bash
redis-cli GET lead:test@example.com
# Should return full lead data with email1SentAt timestamp
```

**Batch results:**
```bash
redis-cli GET batch:results:latest
# Shows results of last batch processing
```

---

## Troubleshooting

### Issue: Webhook returns 401 Unauthorized

**Fix:**
- Verify `Authorization: Bearer YOUR_SECRET` header
- Check WEBHOOK_SECRET environment variable in Vercel
- Ensure no extra spaces in header value

---

### Issue: Email not sending

**Check:**
1. Vercel logs show email send attempt?
2. Rate limiter working? (logs show "Rate limit cleared")
3. Resend API key valid?
4. Email content populated in Notion?

**Debug:**
```bash
# Check if lead was stored in Redis
redis-cli KEYS lead:*

# Check lead data
redis-cli GET lead:your-email@example.com
```

---

### Issue: Notion shows "Webhook failed"

**Cause:** Webhook didn't return 200 in <10 seconds

**Fix:**
- Webhook should return 200 immediately (before email is sent)
- Check Vercel function didn't timeout
- Verify `setImmediate()` is being used for async processing

---

### Issue: Rate limit errors from Resend

**Fix:**
- Rate limiter should prevent this
- Check Redis connection is working
- Verify `waitForRateLimit()` is being called before email send

---

## Performance Testing

### Test 10 Concurrent Webhooks

```bash
for i in {1..10}; do
  curl -X POST https://blosm.dev/api/webhook/notion-v2 \
    -H "Authorization: Bearer YOUR_SECRET" \
    -H "X-Email-Stage: 1" \
    -d '{...}' &
done
wait
```

**Expected:**
- All 10 return 200 within <1 second
- Emails sent sequentially over ~5 seconds (500ms × 10)
- No rate limit errors
- All emails successfully delivered

---

### Test 50 Concurrent Webhooks

```bash
for i in {1..50}; do
  curl -X POST https://blosm.dev/api/webhook/notion-v2 \
    -H "Authorization: Bearer YOUR_SECRET" \
    -H "X-Email-Stage: 1" \
    -d '{...}' &
done
wait
```

**Expected:**
- All 50 return 200 within <5 seconds
- Emails sent over ~25 seconds (500ms × 50)
- Rate limiter coordinates all calls
- Success rate: 98%+

---

## Success Criteria

✅ **Individual webhooks return 200 in <100ms**
✅ **Emails send at exactly 500ms intervals**
✅ **No rate limit errors from Resend**
✅ **No timeout errors from Vercel**
✅ **Lead status updated correctly in Redis**
✅ **100+ concurrent webhooks handled gracefully**

---

## Next Steps

1. ✅ Deploy to production (DONE)
2. ⏳ Test with 1-2 real leads from Notion
3. ⏳ Monitor logs for first batch
4. ⏳ Update all Notion automations to use new webhook
5. ⏳ Remove old webhook endpoint (`/api/webhook/notion.js`) after migration

---

## Quick Reference

**Webhook Endpoints:**
- Individual: `https://blosm.dev/api/webhook/notion-v2`
- Batch: `https://blosm.dev/api/webhook/batch`

**Headers Required:**
```
Authorization: Bearer YOUR_WEBHOOK_SECRET
X-Email-Stage: 1 (or 2 or 3)
Content-Type: application/json
```

**Rate Limit:**
- 2 emails per second (500ms spacing)
- Automatically enforced by rate limiter
- Works across all concurrent function invocations
