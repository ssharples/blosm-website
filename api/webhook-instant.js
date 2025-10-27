/**
 * Notion Webhook Handler - Instant Email Version
 * Receives lead data from Notion and:
 * 1. Sends Email 1 immediately
 * 2. Schedules Email 2 for Thursday cron job
 * 3. Email 3 will be sent the following Monday
 */

import { kv } from '@vercel/kv';
import { sendCampaignEmail } from '../utils/resend-campaign.js';

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify webhook secret
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  const expectedSecret = process.env.NOTION_WEBHOOK_SECRET || 'a5f6eec9fa6383069d9f4b07c9271fa999346ba5e974fb4734516eb3e211359a';

  // Extract token from Bearer header
  const token = authHeader?.replace(/^Bearer\s+/i, '').trim();

  if (token !== expectedSecret) {
    console.error('Webhook auth failed:', {
      received: token?.substring(0, 10) + '...',
      expected: expectedSecret.substring(0, 10) + '...'
    });
    return res.status(401).json({
      error: 'Unauthorized',
      debug: {
        receivedTokenPrefix: token?.substring(0, 10),
        expectedTokenPrefix: expectedSecret.substring(0, 10)
      }
    });
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📬 Notion Instant Email Webhook Received');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Timestamp:', new Date().toISOString());

  try {
    // Handle Notion automation webhook format (nested under 'data')
    const pageData = req.body.data || req.body;
    const page_id = pageData.id || req.body.page_id;
    const properties = pageData.properties || req.body.properties;

    console.log('Page ID:', page_id);
    console.log('Properties received:', Object.keys(properties || {}));

    // Helper function to extract text from Notion property
    function extractText(property) {
      if (!property) return '';

      // Handle title type
      if (property.title) {
        return property.title.map(t => t.plain_text || '').join('');
      }

      // Handle rich_text type
      if (property.rich_text) {
        return property.rich_text.map(t => t.plain_text || '').join('');
      }

      // Handle select type
      if (property.select) {
        return property.select.name || '';
      }

      return '';
    }

    // Extract lead data from Notion properties
    const leadData = {
      pageId: page_id,
      companyName: extractText(properties['Company Name']?.title),
      email: properties['Email']?.email || '',
      demoUrl: properties['Demo URL']?.url || 'https://dentist.blosm.dev/',

      // Email 1 (Will be sent immediately)
      email1Subject: extractText(properties['Email Stage 1 Subject']?.rich_text),
      email1Body: extractText(properties['Email Stage 1 Body']?.rich_text),

      // Email 2 (Thursday follow-up)
      email2Subject: extractText(properties['Email Stage 2 Subject']?.rich_text),
      email2Body: extractText(properties['Email Stage 2 Body']?.rich_text),

      // Email 3 (Next Monday follow-up)
      email3Subject: extractText(properties['Email Stage 3 Subject']?.rich_text),
      email3Body: extractText(properties['Email Stage 3 Body']?.rich_text),

      // Metadata
      queuedAt: new Date().toISOString(),
      status: 'processing',
      source: 'notion-webhook-instant'
    };

    console.log('\nLead Data Extracted:');
    console.log('  Company:', leadData.companyName);
    console.log('  Email:', leadData.email);
    console.log('  Demo URL:', leadData.demoUrl);
    console.log('  Email 1 Subject:', leadData.email1Subject ? '✓' : '✗');
    console.log('  Email 1 Body length:', leadData.email1Body?.length || 0);

    // Validate required fields
    if (!leadData.email) {
      console.error('❌ Missing email address');
      return res.status(400).json({
        error: 'Missing required field: email',
        received: leadData
      });
    }

    // Check if lead already exists to prevent duplicates
    const existingLead = await kv.get(`lead:${leadData.email}`);
    if (existingLead) {
      console.log('⚠️ Lead already exists, updating status only');
    }

    // Send Email 1 immediately
    console.log('\n📧 Sending Email 1 immediately...');

    try {
      const emailResult = await sendCampaignEmail(leadData, 1);
      console.log('✓ Email 1 sent successfully!');
      console.log('  Resend ID:', emailResult?.data?.id || emailResult?.id || 'unknown');

      // Update lead status to email1_sent
      leadData.status = 'email1_sent';
      leadData.email1SentAt = new Date().toISOString();
      leadData.lastUpdated = new Date().toISOString();

    } catch (emailError) {
      console.error('❌ Failed to send Email 1:', emailError.message);

      // Still save the lead but mark as failed
      leadData.status = 'email1_failed';
      leadData.error = emailError.message;

      // Save to KV for retry later
      await kv.set(`lead:${leadData.email}`, leadData);
      await kv.sadd('leads:email1_failed', leadData.email);

      return res.status(500).json({
        error: 'Failed to send email',
        message: emailError.message,
        lead: {
          email: leadData.email,
          company: leadData.companyName
        }
      });
    }

    // Save lead data to KV for Email 2 (Thursday)
    await kv.set(`lead:${leadData.email}`, leadData);

    // Add to email1_sent set (for Thursday cron to pick up)
    await kv.sadd('leads:email1_sent', leadData.email);

    // Remove from any other stages if present
    await kv.srem('leads:queued', leadData.email);
    await kv.srem('leads:email2_sent', leadData.email);
    await kv.srem('leads:completed', leadData.email);

    console.log('\n✅ Lead processed successfully!');
    console.log('  Status: Email 1 sent immediately');
    console.log('  Next: Email 2 scheduled for Thursday');
    console.log('  KV Key:', `lead:${leadData.email}`);
    console.log('  Stage: email1_sent');

    // Log campaign status
    const campaignStats = {
      email1_sent: await kv.scard('leads:email1_sent') || 0,
      email2_sent: await kv.scard('leads:email2_sent') || 0,
      completed: await kv.scard('leads:completed') || 0
    };

    console.log('\n📊 Campaign Status:');
    console.log('  Awaiting Email 2:', campaignStats.email1_sent);
    console.log('  Awaiting Email 3:', campaignStats.email2_sent);
    console.log('  Completed:', campaignStats.completed);

    res.status(200).json({
      success: true,
      message: 'Email 1 sent immediately, Email 2 scheduled for Thursday',
      lead: {
        email: leadData.email,
        company: leadData.companyName,
        status: leadData.status,
        email1SentAt: leadData.email1SentAt,
        nextEmail: 'Email 2 on Thursday'
      },
      campaignStats
    });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    console.error('Stack:', error.stack);

    res.status(500).json({
      error: 'Failed to process webhook',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}