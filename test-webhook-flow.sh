#!/bin/bash

# Test the complete webhook flow
# This simulates what Notion does

WEBHOOK_SECRET="${WEBHOOK_SECRET:-a5f6eec9fa6383069d9f4b07c9271fa999346ba5e974fb4734516eb3e211359a}"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 Testing Webhook Flow"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 1: Initial webhook (should queue or send)
echo "📧 Test 1: Sending initial webhook..."
RESPONSE=$(curl -s -X POST https://blosm.dev/api/webhook/notion-v2 \
  -H "Authorization: Bearer $WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  -H "X-Email-Stage: 1" \
  -d '{
    "data": {
      "id": "test-page-123",
      "properties": {
        "Company Name": {
          "title": [{"plain_text": "Test Company"}]
        },
        "Email": {
          "email": "test@example.com"
        },
        "Demo URL": {
          "url": "https://test.blosm.dev"
        },
        "Email Stage 1 Subject": {
          "rich_text": [{"plain_text": "Test Subject"}]
        },
        "Email Stage 1 Body": {
          "rich_text": [{"plain_text": "Test email body"}]
        }
      }
    }
  }')

echo "Response:"
echo "$RESPONSE" | jq '.'
echo ""

# Check if email was sent or queued
SENT_STATUS=$(echo "$RESPONSE" | jq -r '.sent // "unknown"')
SUCCESS=$(echo "$RESPONSE" | jq -r '.success // false')

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$SUCCESS" = "true" ]; then
    echo "✅ Initial webhook succeeded"
    echo "   Status: $SENT_STATUS"

    if [ "$SENT_STATUS" = "queued" ]; then
        echo ""
        echo "📬 Email was queued, testing queue processor..."
        sleep 2

        # Test 2: Process the queue
        echo ""
        echo "🔄 Test 2: Processing queue..."
        QUEUE_RESPONSE=$(curl -s -X POST https://blosm.dev/api/process-queue-auto \
          -H "Authorization: Bearer $WEBHOOK_SECRET" \
          -H "Content-Type: application/json" \
          -d '{"emailStage": 1}')

        echo "Response:"
        echo "$QUEUE_RESPONSE" | jq '.'

        QUEUE_SUCCESS=$(echo "$QUEUE_RESPONSE" | jq -r '.success // false')
        SENT=$(echo "$QUEUE_RESPONSE" | jq -r '.sent // 0')

        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        if [ "$QUEUE_SUCCESS" = "true" ] && [ "$SENT" -gt 0 ]; then
            echo "✅ Queue processor succeeded"
            echo "   Emails sent: $SENT"
        else
            echo "❌ Queue processor failed or no emails sent"
        fi
    elif [ "$SENT_STATUS" = "immediately" ]; then
        echo "✅ Email sent immediately (rate limiter was clear)"
    fi
else
    echo "❌ Initial webhook failed"
    echo "$RESPONSE"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
