const { Client } = require('@notionhq/client');
const { config } = require('dotenv');
const fs = require('fs');

config({ path: '.env.development.local' });

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID;

console.log('NOTION_TOKEN:', process.env.NOTION_TOKEN ? 'Set' : 'Not set');
console.log('DATABASE_ID:', DATABASE_ID ? 'Set' : 'Not set');
console.log('notion object:', notion);

async function fetchScheduledLeads() {
  try {
    console.log('Fetching leads with Schedule field checked...');

    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        property: 'Schedule',
        checkbox: {
          equals: true
        }
      }
    });

    console.log(`Found ${response.results.length} scheduled leads in Notion`);

    // Extract email addresses from scheduled leads
    const scheduledEmails = response.results.map(page => {
      const email = page.properties['Email']?.email || '';
      const company = page.properties['Company Name']?.title?.[0]?.plain_text || '';
      return { email: email.toLowerCase(), company };
    }).filter(lead => lead.email);

    console.log(`\nScheduled leads with valid emails: ${scheduledEmails.length}`);

    // Read the CSV export from Resend
    const csvContent = fs.readFileSync('/Users/dev/Downloads/emails-1761558826532.csv', 'utf-8');
    const csvLines = csvContent.split('\n').slice(1); // Skip header

    // Extract emails that were actually sent (from campaign emails only)
    const sentEmails = new Set();
    csvLines.forEach(line => {
      if (line.includes('Quick') || line.includes('Website audit') || line.includes('Custom') ||
          line.includes('observation') || line.includes('thought on') || line.includes('demo for')) {
        const fields = line.split(',');
        if (fields[4]) {
          sentEmails.add(fields[4].toLowerCase());
        }
      }
    });

    console.log(`\nEmails sent via Resend: ${sentEmails.size}`);

    // Find missing emails
    const missingLeads = scheduledEmails.filter(lead => !sentEmails.has(lead.email));

    console.log(`\nMissing leads (scheduled but not sent): ${missingLeads.length}`);
    console.log('\nMissing leads details:');
    console.log('------------------------');
    missingLeads.forEach((lead, index) => {
      console.log(`${index + 1}. ${lead.company} - ${lead.email}`);
    });

    // Check for duplicate emails in scheduled leads
    const emailCounts = {};
    scheduledEmails.forEach(lead => {
      emailCounts[lead.email] = (emailCounts[lead.email] || 0) + 1;
    });

    const duplicates = Object.entries(emailCounts).filter(([email, count]) => count > 1);
    if (duplicates.length > 0) {
      console.log('\n⚠️ Duplicate emails found in scheduled leads:');
      duplicates.forEach(([email, count]) => {
        console.log(`  ${email} appears ${count} times`);
      });
    }

    // Summary
    console.log('\n📊 Summary:');
    console.log(`  Total scheduled in Notion: ${scheduledEmails.length}`);
    console.log(`  Total sent via Resend: ${sentEmails.size}`);
    console.log(`  Missing (not sent): ${missingLeads.length}`);
    console.log(`  Bounced emails: 7`);
    console.log(`  Actual delivered: ${sentEmails.size - 7}`);

  } catch (error) {
    console.error('Error fetching scheduled leads:', error);
  }
}

fetchScheduledLeads();