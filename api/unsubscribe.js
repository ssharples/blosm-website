/**
 * Unsubscribe Handler
 * Allows leads to opt-out of email campaigns
 * Accessible via: /api/unsubscribe?email=user@example.com
 */

import { unsubscribeLead, getLead } from './utils/kv.js';

export default async function handler(req, res) {
  const { email } = req.query;

  // Validate email parameter
  if (!email) {
    return res.status(400).send(generateErrorPage('Email parameter is required'));
  }

  try {
    // Get lead data
    const lead = await getLead(email);

    if (!lead) {
      return res.status(404).send(generateErrorPage('Email address not found in our system'));
    }

    // Check if already unsubscribed
    if (lead.stage === 'unsubscribed') {
      return res.status(200).send(generateAlreadyUnsubscribedPage(email));
    }

    // Unsubscribe the lead
    const success = await unsubscribeLead(email);

    if (!success) {
      throw new Error('Failed to unsubscribe');
    }

    console.log(`Unsubscribed: ${email} (${lead.companyName || 'Unknown'})`);

    // Send success page
    res.status(200).send(generateSuccessPage(email, lead));

  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).send(generateErrorPage('An error occurred while processing your request'));
  }
}

/**
 * Generate success page HTML
 */
function generateSuccessPage(email, lead) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Unsubscribed - Blosm</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            max-width: 600px;
            width: 100%;
            padding: 50px 40px;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.15);
            text-align: center;
        }
        .icon {
            font-size: 64px;
            margin-bottom: 20px;
        }
        h1 {
            color: #333;
            font-size: 28px;
            margin-bottom: 15px;
        }
        .email {
            color: #7c3aed;
            font-weight: 600;
            margin: 20px 0;
            padding: 15px;
            background: #f3f4f6;
            border-radius: 6px;
            word-break: break-all;
        }
        p {
            color: #666;
            line-height: 1.6;
            margin-bottom: 15px;
        }
        .info-box {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 20px;
            margin: 30px 0;
            text-align: left;
            border-radius: 4px;
        }
        .info-box p {
            margin: 0;
            color: #92400e;
        }
        .contact {
            margin-top: 40px;
            padding-top: 30px;
            border-top: 1px solid #e5e7eb;
        }
        .contact p {
            color: #999;
            font-size: 14px;
        }
        .contact a {
            color: #7c3aed;
            text-decoration: none;
        }
        .contact a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">✅</div>
        <h1>You've been unsubscribed</h1>
        <p>You will no longer receive automated emails from our campaign.</p>

        <div class="email">${escapeHtml(email)}</div>

        <div class="info-box">
            <p><strong>What this means:</strong></p>
            <p style="margin-top: 10px;">
                You've been removed from our automated email sequence. You won't receive any further follow-up emails related to this campaign.
            </p>
        </div>

        <p>
            If you unsubscribed by mistake or would like to get back in touch,<br>
            please feel free to email us directly.
        </p>

        <div class="contact">
            <p>
                <strong>Scott Sharples</strong><br>
                Blosm Web Development<br>
                <a href="mailto:scott@blosm.dev">scott@blosm.dev</a> ·
                <a href="https://blosm.dev">blosm.dev</a>
            </p>
        </div>
    </div>
</body>
</html>
  `.trim();
}

/**
 * Generate already unsubscribed page HTML
 */
function generateAlreadyUnsubscribedPage(email) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Already Unsubscribed - Blosm</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            max-width: 600px;
            width: 100%;
            padding: 50px 40px;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.15);
            text-align: center;
        }
        .icon {
            font-size: 64px;
            margin-bottom: 20px;
        }
        h1 {
            color: #333;
            font-size: 28px;
            margin-bottom: 15px;
        }
        .email {
            color: #7c3aed;
            font-weight: 600;
            margin: 20px 0;
            padding: 15px;
            background: #f3f4f6;
            border-radius: 6px;
            word-break: break-all;
        }
        p {
            color: #666;
            line-height: 1.6;
        }
        .contact {
            margin-top: 40px;
            padding-top: 30px;
            border-top: 1px solid #e5e7eb;
        }
        .contact p {
            color: #999;
            font-size: 14px;
        }
        .contact a {
            color: #7c3aed;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">ℹ️</div>
        <h1>Already Unsubscribed</h1>
        <p>This email address is already unsubscribed from our campaigns.</p>

        <div class="email">${escapeHtml(email)}</div>

        <p>You won't receive any further automated emails from us.</p>

        <div class="contact">
            <p>
                Questions? Contact us at<br>
                <a href="mailto:scott@blosm.dev">scott@blosm.dev</a>
            </p>
        </div>
    </div>
</body>
</html>
  `.trim();
}

/**
 * Generate error page HTML
 */
function generateErrorPage(message) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error - Blosm</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            max-width: 600px;
            width: 100%;
            padding: 50px 40px;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.15);
            text-align: center;
        }
        .icon {
            font-size: 64px;
            margin-bottom: 20px;
        }
        h1 {
            color: #333;
            font-size: 28px;
            margin-bottom: 15px;
        }
        p {
            color: #666;
            line-height: 1.6;
        }
        .contact {
            margin-top: 40px;
            padding-top: 30px;
            border-top: 1px solid #e5e7eb;
        }
        .contact p {
            color: #999;
            font-size: 14px;
        }
        .contact a {
            color: #7c3aed;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">⚠️</div>
        <h1>Oops!</h1>
        <p>${escapeHtml(message)}</p>

        <div class="contact">
            <p>
                Need help? Contact us at<br>
                <a href="mailto:scott@blosm.dev">scott@blosm.dev</a>
            </p>
        </div>
    </div>
</body>
</html>
  `.trim();
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
