/**
 * Test Campaign Email Direct
 */

import { sendCampaignEmail } from './utils/resend-campaign.js';

export default async function handler(req, res) {
  const testLead = {
    email: 'sasharples@icloud.com',
    contactName: 'Alex',
    companyName: 'Adelphi Dental Care',
    email1Subject: 'Quick question about Adelphi Dental Care\'s website',
    email1Body: 'Hi Alex,\n\nI was browsing Adelphi Dental Care\'s website on mobile and noticed it could benefit from a refresh – especially with how many people search for dentists on their phones these days.\n\nI specialise in modernising dental practice websites, and I\'d love to show you what a new site could look like for Adelphi. I can create a free demo for you – no cost, no obligation.\n\nWould you be interested in seeing it?'
  };

  try {
    console.log('Testing sendCampaignEmail function directly...');
    const result = await sendCampaignEmail(testLead, 1);

    return res.status(200).json({
      success: true,
      message: 'Campaign email sent',
      result: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
}
