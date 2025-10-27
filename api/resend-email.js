/**
 * Resend Email Integration for Blosm Booking System
 * Sends branded confirmation emails matching each business website
 */

const { Resend } = require('resend');
const fs = require('fs').promises;
const path = require('path');

class ResendEmailService {
    constructor() {
        this.resend = new Resend(process.env.RESEND_API_KEY);
        this.fromEmail = process.env.RESEND_FROM_EMAIL || 'hello@updates.blosm.dev';
        this.replyToEmail = process.env.REPLY_TO_EMAIL || 'scott@blosm.dev';
    }

    /**
     * Send booking confirmation email
     * @param {Object} bookingData - Booking information
     * @param {Object} calendarEvent - Google Calendar event details
     * @param {Object} businessBranding - Business design system colors/fonts
     * @returns {Object} Email send result
     */
    async sendConfirmationEmail(bookingData, calendarEvent, businessBranding = {}) {
        const { name, email, company } = bookingData;
        const { meetingLink, startTime, endTime } = calendarEvent;

        // Generate branded HTML email
        const htmlContent = await this.generateBrandedEmail(
            bookingData,
            calendarEvent,
            businessBranding
        );

        // Plain text fallback
        const textContent = this.generatePlainTextEmail(bookingData, calendarEvent);

        try {
            const response = await this.resend.emails.send({
                from: `Blosm <${this.fromEmail}>`,
                to: [email],
                cc: ['scott@blosm.dev'],
                reply_to: 'scott@blosm.dev',
                subject: `Your Website Consultation is Confirmed - ${company}`,
                html: htmlContent,
                text: textContent,
                tags: [
                    { name: 'category', value: 'booking-confirmation' },
                    { name: 'business', value: (company || 'unknown').replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase() }
                ]
            });

            // Check if Resend returned an error
            if (response.error) {
                console.error('Resend API returned error:', response.error);
                throw new Error(`Resend API error: ${response.error.message}`);
            }

            console.log('✓ Booking confirmation email sent:', {
                emailId: response.data?.id || response.id,
                to: email,
                company: company
            });

            return {
                success: true,
                emailId: response.data?.id || response.id,
                message: 'Confirmation email sent successfully'
            };
        } catch (error) {
            console.error('Resend Email Error:', error);
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }

    /**
     * Generate branded HTML email matching business website
     * @param {Object} bookingData - Booking information
     * @param {Object} calendarEvent - Calendar event details
     * @param {Object} branding - Business branding (colors, fonts, logo)
     * @returns {string} HTML email content
     */
    async generateBrandedEmail(bookingData, calendarEvent, branding) {
        const { name, company } = bookingData;
        const { meetingLink, startTime } = calendarEvent;

        // Default branding if none provided
        const primaryColor = branding.primaryColor || '#7c3aed'; // Purple
        const secondaryColor = branding.secondaryColor || '#a78bfa';
        const accentColor = branding.accentColor || '#c4b5fd';
        const logoUrl = branding.logoUrl || '';

        // Format date/time nicely
        const meetingDate = new Date(startTime);
        const formattedDate = meetingDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const formattedTime = meetingDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            timeZoneName: 'short'
        });

        // Read the branded email template
        const templatePath = path.join(__dirname, 'email-template.html');
        let template = await fs.readFile(templatePath, 'utf-8');

        // Replace template variables
        template = template
            .replace(/\{\{NAME\}\}/g, name)
            .replace(/\{\{COMPANY\}\}/g, company)
            .replace(/\{\{MEETING_DATE\}\}/g, formattedDate)
            .replace(/\{\{MEETING_TIME\}\}/g, formattedTime)
            .replace(/\{\{MEETING_LINK\}\}/g, meetingLink)
            .replace(/\{\{PRIMARY_COLOR\}\}/g, primaryColor)
            .replace(/\{\{SECONDARY_COLOR\}\}/g, secondaryColor)
            .replace(/\{\{ACCENT_COLOR\}\}/g, accentColor)
            .replace(/\{\{LOGO_URL\}\}/g, logoUrl)
            .replace(/\{\{CURRENT_YEAR\}\}/g, new Date().getFullYear().toString());

        return template;
    }

    /**
     * Generate plain text email fallback
     * @param {Object} bookingData - Booking information
     * @param {Object} calendarEvent - Calendar event details
     * @returns {string} Plain text email content
     */
    generatePlainTextEmail(bookingData, calendarEvent) {
        const { name, company } = bookingData;
        const { meetingLink, startTime } = calendarEvent;

        const meetingDate = new Date(startTime);
        const formattedDate = meetingDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const formattedTime = meetingDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            timeZoneName: 'short'
        });

        return `
Hi ${name},

Your website consultation is confirmed! 🎉

Meeting Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 ${formattedDate}
⏰ ${formattedTime}
💼 ${company}

Join Meeting:
${meetingLink}

What to Expect:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Review your custom demo website
✓ Discuss customization options
✓ Transparent pricing (setup & hosting)
✓ Simple, no-contract terms
✓ Next steps to go live

We're excited to show you how your new website can transform your online presence!

Best regards,
Scott Sharples
Blosm
scott@blosm.dev
+44 7438 187309
https://blosm.dev

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This meeting was scheduled through your demo website preview.
Demo URL: https://${company.toLowerCase().replace(/\s+/g, '-')}.blosm.dev

© ${new Date().getFullYear()} Blosm. All rights reserved.
        `.trim();
    }

    /**
     * Send reminder email 1 day before meeting
     * @param {Object} bookingData - Booking information
     * @param {Object} calendarEvent - Calendar event details
     * @returns {Object} Email send result
     */
    async sendReminderEmail(bookingData, calendarEvent) {
        const { name, email, company } = bookingData;
        const { meetingLink, startTime } = calendarEvent;

        const meetingDate = new Date(startTime);
        const formattedTime = meetingDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            timeZoneName: 'short'
        });

        const htmlContent = `
            <h2>Reminder: Your Website Consultation Tomorrow</h2>
            <p>Hi ${name},</p>
            <p>This is a friendly reminder about your consultation tomorrow at ${formattedTime}.</p>
            <p><a href="${meetingLink}" style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Join Meeting</a></p>
        `;

        try {
            const response = await this.resend.emails.send({
                from: `Blosm <${this.fromEmail}>`,
                to: [email],
                reply_to: 'scott@blosm.dev',
                subject: `Tomorrow: Website Consultation for ${company}`,
                html: htmlContent,
                tags: [
                    { name: 'category', value: 'meeting-reminder' },
                    { name: 'business', value: (company || 'unknown').replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase() }
                ]
            });

            // Check if Resend returned an error
            if (response.error) {
                console.error('Resend API returned error:', response.error);
                throw new Error(`Resend API error: ${response.error.message}`);
            }

            return { success: true, emailId: response.data?.id || response.id };
        } catch (error) {
            console.error('Reminder Email Error:', error);
            throw new Error(`Failed to send reminder: ${error.message}`);
        }
    }
}

module.exports = ResendEmailService;
