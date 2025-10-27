/**
 * Test Resend API Configuration
 * Simple endpoint to verify Resend API is working
 */

import { Resend } from 'resend';

export default async function handler(req, res) {
  // Check if API key is configured
  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({
      error: 'RESEND_API_KEY not configured',
      env_check: {
        RESEND_API_KEY: 'MISSING',
        RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL || 'MISSING',
        REPLY_TO_EMAIL: process.env.REPLY_TO_EMAIL || 'MISSING'
      }
    });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    // Try to send a simple test email
    const response = await resend.emails.send({
      from: `Blosm Test <${process.env.RESEND_FROM_EMAIL || 'hello@updates.blosm.dev'}>`,
      to: [req.query.email || 'sasharples@icloud.com'],
      replyTo: process.env.REPLY_TO_EMAIL || 'scott@blosm.dev',
      subject: 'Test Email from Blosm',
      html: '<p>This is a test email to verify Resend API is working.</p>',
      text: 'This is a test email to verify Resend API is working.'
    });

    return res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      resend_response: response,
      config: {
        api_key_present: true,
        api_key_prefix: process.env.RESEND_API_KEY.substring(0, 10) + '...',
        from_email: process.env.RESEND_FROM_EMAIL,
        reply_to: process.env.REPLY_TO_EMAIL
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      error_details: error.response?.data || error,
      config: {
        api_key_present: true,
        api_key_prefix: process.env.RESEND_API_KEY.substring(0, 10) + '...',
        from_email: process.env.RESEND_FROM_EMAIL,
        reply_to: process.env.REPLY_TO_EMAIL
      }
    });
  }
}
