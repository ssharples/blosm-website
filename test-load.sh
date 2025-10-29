#!/bin/bash

# Test batch webhook processing (simulates 200+ webhooks)
# Sends 10 webhooks rapidly to test queueing

WEBHOOK_SECRET="${WEBHOOK_SECRET:-a5f6eec9fa6383069d9f4b07c9271fa999346ba5e974fb4734516eb3e211359a}"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔥 Load Test: Batch Webhook Processing"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Sending 10 webhooks rapidly (simulating batch)..."
echo ""

SENT_IMMEDIATELY=0
QUEUED=0

# Send 10 webhooks in parallel
for i in {1..10}; do
  (
    RESPONSE=$(curl -s -X POST https://blosm.dev/api/webhook/notion-v2 \
      -H "Authorization: Bearer $WEBHOOK_SECRET" \
      -H "Content-Type: application/json" \
      -H "X-Email-Stage: 1" \
      -d "{
        \"data\": {
          \"id\": \"test-page-$i\",
          \"properties\": {
            \"Company Name\": {
              \"title\": [{\"plain_text\": \"Test Company $i\"}]
            },
            \"Email\": {
              \"email\": \"test$i@example.com\"
            },
            \"Demo URL\": {
              \"url\": \"https://test$i.blosm.dev\"
            },
            \"Email Stage 1 Subject\": {
              \"rich_text\": [{\"plain_text\": \"Test Subject $i\"}]
            },
            \"Email Stage 1 Body\": {
              \"rich_text\": [{\"plain_text\": \"Test email body $i\"}]
            }
          }
        }
      }")

    SENT_STATUS=$(echo "$RESPONSE" | jq -r '.sent // "unknown"')
    echo "Webhook $i: $SENT_STATUS"
  ) &
done

# Wait for all webhooks to complete
wait

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "All webhooks sent! Checking queue status..."
echo ""

sleep 2

# Check queue status
QUEUE_STATUS=$(curl -s -X POST https://blosm.dev/api/process-queue-auto \
  -H "Authorization: Bearer $WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"emailStage": 1}')

echo "Queue Status:"
echo "$QUEUE_STATUS" | jq '.'
echo ""

REMAINING=$(echo "$QUEUE_STATUS" | jq -r '.remaining // 0')
PROCESSED=$(echo "$QUEUE_STATUS" | jq -r '.processed // 0')
SENT=$(echo "$QUEUE_STATUS" | jq -r '.sent // 0')

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Results:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Webhooks sent: 10"
echo "Queue processed: $PROCESSED"
echo "Emails sent from queue: $SENT"
echo "Still in queue: $REMAINING"
echo ""

if [ "$REMAINING" -gt 0 ]; then
  echo "⚠️  Queue still has $REMAINING emails"
  echo "Run this again or wait for Notion automation to process them"
else
  echo "✅ All emails processed successfully!"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
