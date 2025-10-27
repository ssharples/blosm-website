/**
 * Resend Email Helper for Automated Campaigns
 * Sends personalized email campaigns with subject and body variables
 */

import { Resend } from 'resend';
import { promises as fs } from 'fs';
import path from 'path';

const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'hello@updates.blosm.dev';
const REPLY_TO_EMAIL = process.env.REPLY_TO_EMAIL || 'scott@blosm.dev';

/**
 * Load and cache email template
 */
let emailTemplateCache = null;

async function loadEmailTemplate() {
  if (emailTemplateCache) {
    return emailTemplateCache;
  }

  const templatePath = path.join(process.cwd(), 'templates', 'email-campaign-template.html');
  emailTemplateCache = await fs.readFile(templatePath, 'utf8');
  return emailTemplateCache;
}

/**
 * Send campaign email to lead
 * @param {Object} lead - Lead data from KV
 * @param {number} emailNumber - Email number (1, 2, or 3)
 * @returns {Promise<Object>} Resend response
 */
export async function sendCampaignEmail(lead, emailNumber) {
  const subject = lead[`email${emailNumber}Subject`];
  const body = lead[`email${emailNumber}Body`];

  if (!subject || !body) {
    throw new Error(`Missing email ${emailNumber} subject or body for ${lead.email}`);
  }

  // Load template
  const template = await loadEmailTemplate();

  // Replace variables in template
  const html = template
    .replace(/\{\{email_subject\}\}/g, escapeHtml(subject))
    .replace(/\{\{\{email_body\}\}\}/g, formatEmailBody(body))
    .replace(/\{\{lead_email\}\}/g, encodeURIComponent(lead.email))
    .replace(/\{\{contact_name\}\}/g, escapeHtml(lead.contactName || 'there'))
    .replace(/\{\{company_name\}\}/g, escapeHtml(lead.companyName || 'your company'))
    .replace(/\{\{demo_url\}\}/g, lead.demoUrl || 'https://dentist.blosm.dev/');

  // Generate plain text version
  const text = generatePlainText(subject, body, lead);

  console.log(`Attempting to send email ${emailNumber} to ${lead.email}...`);
  console.log(`Subject: ${subject}`);
  console.log(`Body length: ${body.length} chars`);
  console.log(`HTML length: ${html.length} chars`);

  try {
    const response = await resend.emails.send({
      from: `Scott Sharples <${FROM_EMAIL}>`,
      to: [lead.email],
      reply_to: 'scott@blosm.dev',
      subject: subject,
      html: html,
      text: text,
      headers: {
        'X-Campaign-ID': `email-${emailNumber}`,
        'X-Lead-Email': lead.email,
        'X-Company-Name': lead.companyName || 'Unknown'
      },
      tags: [
        { name: 'campaign', value: 'cold-outreach' },
        { name: 'email_number', value: `email-${emailNumber}` },
        { name: 'company', value: (lead.companyName || 'unknown').replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase() }
      ]
    });

    // Check if Resend returned an error
    if (response.error) {
      console.error(`✗ Resend API returned error:`, response.error);
      throw new Error(`Resend API error: ${response.error.message}`);
    }

    console.log(`✓ Email ${emailNumber} sent successfully!`);
    console.log(`  To: ${lead.email}`);
    console.log(`  Company: ${lead.companyName}`);
    console.log(`  Resend ID: ${response.data?.id || response.id}`);
    console.log(`  Full response:`, JSON.stringify(response, null, 2));

    return response;
  } catch (error) {
    console.error(`✗ FAILED to send email ${emailNumber} to ${lead.email}`);
    console.error(`  Error message:`, error.message);
    console.error(`  Error stack:`, error.stack);
    console.error(`  Full error:`, JSON.stringify(error, null, 2));
    throw error;
  }
}

/**
 * Format email body for HTML
 * Converts newlines to paragraphs and escapes all HTML for safety
 * Double newlines (\n\n) create paragraph breaks
 * @param {string} body - Raw email body text
 * @returns {string} HTML formatted body
 */
function formatEmailBody(body) {
  // Strip any HTML tags from the body for safety
  const cleanBody = body.replace(/<[^>]*>/g, '');

  // Split by double newlines to get paragraphs
  const paragraphs = cleanBody.split(/\n\n+/);

  return paragraphs
    .map(para => para.trim())
    .filter(para => para.length > 0)
    .map(para => {
      // Escape HTML first, then replace newlines with <br>
      const escapedPara = escapeHtml(para);
      const formattedPara = escapedPara.replace(/\n/g, '<br>');
      return `<p style="margin: 0 0 16px 0;">${formattedPara}</p>`;
    })
    .join('\n');
}

/**
 * Generate plain text version of email
 * @param {string} subject - Email subject
 * @param {string} body - Email body
 * @param {Object} lead - Lead data
 * @returns {string} Plain text email
 */
function generatePlainText(subject, body, lead) {
  // Strip any HTML from body
  const cleanBody = body.replace(/<[^>]*>/g, '');

  // Generate demo URL
  const demoUrl = lead.demoUrl || 'https://dentist.blosm.dev/';

  return `
${cleanBody}

► Yes, Show Me The Demo:
${demoUrl}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If you'd prefer not to receive these emails, you can unsubscribe here:
https://blosm.dev/api/unsubscribe?email=${encodeURIComponent(lead.email)}

Scott Sharples
Blosm Web Development
Manchester, UK
scott@blosm.dev
+44 7438 187309
https://blosm.dev
  `.trim();
}

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
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

/**
 * Send test email
 * @param {string} testEmail - Email address to send test to
 * @param {Object} testData - Test lead data
 * @param {number} emailNumber - Email number to test
 * @returns {Promise<Object>}
 */
export async function sendTestEmail(testEmail, testData, emailNumber = 1) {
  const testLead = {
    email: testEmail,
    contactName: testData.contactName || 'Test User',
    companyName: testData.companyName || 'Test Company',
    email1Subject: testData.subject || 'Test Email Subject',
    email1Body: testData.body || 'This is a test email body.\n\nIt has multiple paragraphs.',
    email2Subject: testData.subject || 'Test Follow-up Subject',
    email2Body: testData.body || 'This is a test follow-up.',
    email3Subject: testData.subject || 'Test Final Follow-up',
    email3Body: testData.body || 'This is the final test email.'
  };

  return await sendCampaignEmail(testLead, emailNumber);
}
