#!/bin/bash

# Email Queue Processor Script
# Processes all queued emails until queue is empty
# Usage: ./process-email-queue.sh [email_stage]

WEBHOOK_SECRET="${WEBHOOK_SECRET:-your-secret-here}"
EMAIL_STAGE="${1:-1}"
API_URL="https://blosm.dev/api/process-queue-auto"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📬 Processing Email Queue - Stage $EMAIL_STAGE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if WEBHOOK_SECRET is set
if [ "$WEBHOOK_SECRET" = "your-secret-here" ]; then
    echo "❌ Error: WEBHOOK_SECRET not set"
    echo "   Set it in your environment or .env file"
    exit 1
fi

ITERATION=1
TOTAL_SENT=0
TOTAL_FAILED=0

while true; do
    echo "🔄 Iteration $ITERATION..."

    # Call the auto processor
    RESPONSE=$(curl -s -X POST "$API_URL" \
        -H "Authorization: Bearer $WEBHOOK_SECRET" \
        -H "Content-Type: application/json" \
        -d "{\"emailStage\": $EMAIL_STAGE}")

    # Parse response
    SUCCESS=$(echo "$RESPONSE" | jq -r '.success // false')
    SENT=$(echo "$RESPONSE" | jq -r '.sent // 0')
    FAILED=$(echo "$RESPONSE" | jq -r '.failed // 0')
    REMAINING=$(echo "$RESPONSE" | jq -r '.remaining // 0')
    QUEUE_EMPTY=$(echo "$RESPONSE" | jq -r '.queueEmpty // false')
    EXEC_TIME=$(echo "$RESPONSE" | jq -r '.executionTime // 0')

    # Update totals
    TOTAL_SENT=$((TOTAL_SENT + SENT))
    TOTAL_FAILED=$((TOTAL_FAILED + FAILED))

    echo "   Sent: $SENT | Failed: $FAILED | Remaining: $REMAINING | Time: ${EXEC_TIME}ms"

    # Check if done
    if [ "$QUEUE_EMPTY" = "true" ]; then
        echo ""
        echo "✅ Queue empty!"
        break
    fi

    if [ "$SUCCESS" != "true" ]; then
        echo ""
        echo "❌ Error processing queue:"
        echo "$RESPONSE" | jq '.'
        break
    fi

    if [ "$REMAINING" = "0" ]; then
        echo ""
        echo "✅ All emails sent!"
        break
    fi

    # Increment iteration
    ITERATION=$((ITERATION + 1))

    # Small delay between batches
    sleep 1
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Final Results"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   Total sent: $TOTAL_SENT"
echo "   Total failed: $TOTAL_FAILED"
echo "   Iterations: $ITERATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
