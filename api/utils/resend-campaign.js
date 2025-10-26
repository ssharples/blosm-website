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
    .replace(/\{\{company_name\}\}/g, escapeHtml(lead.companyName || 'your company'));

  // Generate plain text version
  const text = generatePlainText(subject, body, lead);

  try {
    const response = await resend.emails.send({
      from: `Scott from Blosm <${FROM_EMAIL}>`,
      to: [lead.email],
      replyTo: REPLY_TO_EMAIL,
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
        { name: 'company', value: lead.companyName || 'unknown' }
      ]
    });

    console.log(`✓ Email ${emailNumber} sent to ${lead.email} (${lead.companyName}) - ID: ${response.id}`);

    return response;
  } catch (error) {
    console.error(`✗ Failed to send email ${emailNumber} to ${lead.email}:`, error);
    throw error;
  }
}

/**
 * Format email body for HTML
 * Converts newlines to <br> tags and preserves formatting
 * @param {string} body - Raw email body text
 * @returns {string} HTML formatted body
 */
function formatEmailBody(body) {
  return body
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => `<p style="margin: 0 0 16px 0;">${escapeHtml(line)}</p>`)
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
  return `
${body}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If you'd prefer not to receive these emails, you can unsubscribe here:
https://blosm.dev/api/unsubscribe?email=${encodeURIComponent(lead.email)}

Scott Sharples
Blosm Web Development
Manchester, UK
scott@blosm.dev
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
