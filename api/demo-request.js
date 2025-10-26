/**
 * Blosm Demo Request API Endpoint (Vercel Serverless Function)
 * Handles demo request form submissions from the main website
 */

const { Resend } = require('resend');

/**
 * Main serverless handler for Vercel
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
module.exports = async (req, res) => {
    // CORS headers - Allow all blosm.dev subdomains
    const origin = req.headers.origin;
    const allowedOrigins = [
        'https://blosm.dev',
        'https://www.blosm.dev'
    ];

    // Allow all *.blosm.dev subdomains
    if (origin && (allowedOrigins.includes(origin) || origin.endsWith('.blosm.dev'))) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    } else if (!origin) {
        // Same-origin requests
        res.setHeader('Access-Control-Allow-Origin', '*');
    } else {
        res.setHeader('Access-Control-Allow-Origin', '*');
    }

    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    // Only accept POST
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed'
        });
    }

    try {
        // Parse demo request data
        const demoData = req.body;

        // Validate required fields
        const validation = validateDemoData(demoData);
        if (!validation.valid) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: validation.errors
            });
        }

        // Initialize Resend
        const resend = new Resend(process.env.RESEND_API_KEY);
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'hello@updates.blosm.dev';
        const replyToEmail = process.env.REPLY_TO_EMAIL || 'scott@blosm.dev';
        const notificationEmail = process.env.NOTIFICATION_EMAIL || 'scott@blosm.dev';

        // Send notification to Blosm team
        const notificationResult = await resend.emails.send({
            from: `Blosm Demo Requests <${fromEmail}>`,
            to: [notificationEmail],
            replyTo: replyToEmail,
            subject: `🚀 New Demo Request: ${demoData.business_name}`,
            html: generateNotificationEmail(demoData),
            tags: [
                { name: 'category', value: 'demo-request' },
                { name: 'business', value: demoData.business_name }
            ]
        });

        // Send confirmation to customer
        const confirmationResult = await resend.emails.send({
            from: `Blosm <${fromEmail}>`,
            to: [demoData.email],
            replyTo: replyToEmail,
            subject: `Your Free Demo is Being Created - ${demoData.business_name}`,
            html: generateConfirmationEmail(demoData),
            text: generatePlainTextConfirmation(demoData),
            tags: [
                { name: 'category', value: 'demo-confirmation' },
                { name: 'business', value: demoData.business_name }
            ]
        });

        // Log successful demo request
        console.log('Demo request created successfully:', {
            business: demoData.business_name,
            website: demoData.website_url,
            email: demoData.email,
            notificationId: notificationResult.id,
            confirmationId: confirmationResult.id
        });

        // Return success response
        return res.status(200).json({
            success: true,
            message: 'Demo request received! Check your email for updates.',
            data: {
                emailSent: true,
                estimatedDelivery: '24 hours'
            }
        });

    } catch (error) {
        console.error('Demo Request Error:', error);

        return res.status(500).json({
            success: false,
            error: 'Failed to process demo request',
            message: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

/**
 * Validate demo request form data
 * @param {Object} data - Demo request data from form
 * @returns {Object} Validation result
 */
function validateDemoData(data) {
    const errors = [];

    // Required fields
    if (!data.business_name || data.business_name.trim().length === 0) {
        errors.push('Business name is required');
    }

    if (!data.website_url || !isValidUrl(data.website_url)) {
        errors.push('Valid website URL is required');
    }

    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Valid email is required');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} True if valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate URL format
 * @param {string} url - Website URL
 * @returns {boolean} True if valid
 */
function isValidUrl(url) {
    try {
        // Add protocol if missing
        const urlToTest = url.startsWith('http://') || url.startsWith('https://')
            ? url
            : `https://${url}`;
        new URL(urlToTest);
        return true;
    } catch {
        return false;
    }
}

/**
 * Generate notification email for Blosm team
 * @param {Object} data - Demo request data
 * @returns {string} HTML email content
 */
function generateNotificationEmail(data) {
    const { business_name, website_url, email, phone } = data;

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 20px; }
        .label { font-weight: 600; color: #374151; display: block; margin-bottom: 5px; }
        .value { color: #1f2937; font-size: 16px; }
        .button { background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0;">🚀 New Demo Request</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">A new business wants to see their demo website!</p>
        </div>
        <div class="content">
            <div class="field">
                <span class="label">Business Name:</span>
                <span class="value">${business_name}</span>
            </div>
            <div class="field">
                <span class="label">Current Website:</span>
                <span class="value"><a href="${website_url}" target="_blank" style="color: #7c3aed;">${website_url}</a></span>
            </div>
            <div class="field">
                <span class="label">Email:</span>
                <span class="value"><a href="mailto:${email}" style="color: #7c3aed;">${email}</a></span>
            </div>
            ${phone ? `
            <div class="field">
                <span class="label">Phone:</span>
                <span class="value"><a href="tel:${phone}" style="color: #7c3aed;">${phone}</a></span>
            </div>
            ` : ''}
            <div class="field" style="margin-top: 30px; padding-top: 30px; border-top: 2px solid #e5e7eb;">
                <span class="label">Next Steps:</span>
                <ol style="margin: 10px 0; padding-left: 20px; color: #1f2937;">
                    <li>Visit <a href="${website_url}" target="_blank" style="color: #7c3aed;">${website_url}</a> to analyze the site</li>
                    <li>Run the AI extraction pipeline to gather content</li>
                    <li>Generate demo website using automation</li>
                    <li>Send demo link to ${email} within 24 hours</li>
                </ol>
            </div>
            <a href="https://notion.so" class="button">Open Notion Dashboard →</a>
        </div>
    </div>
</body>
</html>
    `.trim();
}

/**
 * Generate confirmation email for customer
 * @param {Object} data - Demo request data
 * @returns {string} HTML email content
 */
function generateConfirmationEmail(data) {
    const { business_name, website_url, email } = data;

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%); color: white; padding: 40px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { background: #ffffff; padding: 40px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .icon { font-size: 48px; margin-bottom: 10px; }
        h1 { margin: 0; font-size: 28px; }
        h2 { color: #7c3aed; margin-top: 0; }
        .timeline { margin: 30px 0; }
        .step { display: flex; margin-bottom: 20px; }
        .step-number { background: #7c3aed; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; margin-right: 15px; flex-shrink: 0; }
        .step-content { flex: 1; }
        .step-title { font-weight: 600; color: #374151; margin-bottom: 5px; }
        .step-desc { color: #6b7280; font-size: 14px; }
        .cta { background: #7c3aed; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; font-weight: 600; }
        .footer { text-align: center; margin-top: 30px; padding-top: 30px; border-top: 2px solid #f3f4f6; color: #6b7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="icon">🎉</div>
            <h1>Your Demo is On Its Way!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.95; font-size: 18px;">We're analyzing ${website_url} right now</p>
        </div>
        <div class="content">
            <h2>What Happens Next?</h2>

            <div class="timeline">
                <div class="step">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <div class="step-title">AI Website Analysis (Next Few Hours)</div>
                        <div class="step-desc">Our AI analyzes your current website to understand your business, extract content, and identify modernization opportunities.</div>
                    </div>
                </div>

                <div class="step">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <div class="step-title">Template Selection</div>
                        <div class="step-desc">We select the perfect premium template for your industry and apply your brand colors, fonts, and style.</div>
                    </div>
                </div>

                <div class="step">
                    <div class="step-number">3</div>
                    <div class="step-content">
                        <div class="step-title">Demo Generation</div>
                        <div class="step-desc">Your custom demo website is built with modern design, mobile optimization, and SEO-friendly structure.</div>
                    </div>
                </div>

                <div class="step">
                    <div class="step-number">4</div>
                    <div class="step-content">
                        <div class="step-title">Delivered to Your Inbox (Within 24 Hours)</div>
                        <div class="step-desc">You'll receive an email with your demo link and website audit report. No obligation—review at your own pace!</div>
                    </div>
                </div>
            </div>

            <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; border-left: 4px solid #7c3aed; margin: 30px 0;">
                <p style="margin: 0; color: #374151;"><strong>✨ What You'll Get:</strong></p>
                <ul style="margin: 10px 0; padding-left: 20px; color: #6b7280;">
                    <li>Live preview of your modernized website</li>
                    <li>Free website audit report</li>
                    <li>Recommendations for improvements</li>
                    <li>No credit card required—completely free</li>
                </ul>
            </div>

            <div style="text-align: center; margin-top: 40px;">
                <p style="color: #6b7280; margin-bottom: 15px;">Questions? We're here to help!</p>
                <a href="mailto:scott@blosm.dev" style="color: #7c3aed; text-decoration: none; font-weight: 600;">scott@blosm.dev</a>
            </div>

            <div class="footer">
                <p><strong>${business_name}</strong></p>
                <p>Demo requested for: ${website_url}</p>
                <p style="margin-top: 20px;">© ${new Date().getFullYear()} Blosm. All rights reserved.<br>
                Professional websites in 7 days, not weeks.</p>
            </div>
        </div>
    </div>
</body>
</html>
    `.trim();
}

/**
 * Generate plain text confirmation email
 * @param {Object} data - Demo request data
 * @returns {string} Plain text email content
 */
function generatePlainTextConfirmation(data) {
    const { business_name, website_url } = data;

    return `
🎉 Your Demo is On Its Way!

Hi there,

Thank you for requesting a free demo from Blosm! We're analyzing ${website_url} right now.

What Happens Next?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. AI Website Analysis (Next Few Hours)
   Our AI analyzes your current website to understand your business, extract content, and identify modernization opportunities.

2. Template Selection
   We select the perfect premium template for your industry and apply your brand colors, fonts, and style.

3. Demo Generation
   Your custom demo website is built with modern design, mobile optimization, and SEO-friendly structure.

4. Delivered to Your Inbox (Within 24 Hours)
   You'll receive an email with your demo link and website audit report. No obligation—review at your own pace!

What You'll Get:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Live preview of your modernized website
✓ Free website audit report
✓ Recommendations for improvements
✓ No credit card required—completely free

Questions? We're here to help!
Email: scott@blosm.dev

Best regards,
Scott Sharples
Blosm
https://blosm.dev

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${business_name}
Demo requested for: ${website_url}

© ${new Date().getFullYear()} Blosm. All rights reserved.
Professional websites in 7 days, not weeks.
    `.trim();
}
