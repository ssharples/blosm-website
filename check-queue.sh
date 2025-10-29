#!/bin/bash

# Check current Redis queue status
# This diagnostic shows what's actually in the queue

WEBHOOK_SECRET="${WEBHOOK_SECRET:-a5f6eec9fa6383069d9f4b07c9271fa999346ba5e974fb4734516eb3e211359a}"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Redis Queue Diagnostic"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Create a test page to check queue status
cat > /tmp/check-queue-page.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Queue Status Checker</title>
</head>
<body>
    <h1>Checking Queue Status...</h1>
    <pre id="result">Loading...</pre>

    <script>
    async function checkQueue() {
        try {
            // Try to call the queue processor with a diagnostic mode
            const response = await fetch('https://blosm.dev/api/process-queue-auto', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + 'a5f6eec9fa6383069d9f4b07c9271fa999346ba5e974fb4734516eb3e211359a',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ emailStage: 1 })
            });

            const data = await response.json();
            document.getElementById('result').textContent = JSON.stringify(data, null, 2);
        } catch (error) {
            document.getElementById('result').textContent = 'Error: ' + error.message;
        }
    }

    checkQueue();
    </script>
</body>
</html>
EOF

echo "Created diagnostic page at: /tmp/check-queue-page.html"
echo ""
echo "Testing queue processor to see current queue status..."
echo ""

RESPONSE=$(curl -s -X POST https://blosm.dev/api/process-queue-auto \
  -H "Authorization: Bearer $WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"emailStage": 1}')

echo "Queue Status:"
echo "$RESPONSE" | jq '.'
echo ""

REMAINING=$(echo "$RESPONSE" | jq -r '.remaining // 0')
PROCESSED=$(echo "$RESPONSE" | jq -r '.processed // 0')
QUEUE_EMPTY=$(echo "$RESPONSE" | jq -r '.queueEmpty // false')

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📈 Summary:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Emails in queue: $REMAINING"
echo "Processed this run: $PROCESSED"
echo "Queue empty: $QUEUE_EMPTY"
echo ""

if [ "$QUEUE_EMPTY" = "true" ] && [ "$PROCESSED" -eq 0 ]; then
    echo "⚠️  DIAGNOSIS: Queue is empty!"
    echo ""
    echo "This means the initial webhook (api/webhook/notion-v2) has NOT been"
    echo "receiving requests from Notion. The queue processor works, but there's"
    echo "nothing to process."
    echo ""
    echo "You need to set up the INITIAL webhook automation in Notion:"
    echo "  1. Trigger: When 'Send Email 1' checkbox is checked"
    echo "  2. Action: Send webhook to https://blosm.dev/api/webhook/notion-v2"
    echo "  3. Add header: X-Email-Stage: 1"
    echo "  4. Add header: Authorization: Bearer <secret>"
    echo ""
elif [ "$REMAINING" -gt 0 ]; then
    echo "✅ Queue has $REMAINING emails waiting to be sent"
    echo ""
    echo "Your queue processor automation should handle these."
    echo ""
else
    echo "✅ Queue was processed successfully"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
