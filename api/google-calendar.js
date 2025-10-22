/**
 * Google Calendar Integration for Blosm Booking System
 * Creates calendar events for demo website consultations
 */

const { google } = require('googleapis');

class GoogleCalendarService {
    constructor() {
        this.oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );

        // Set credentials with refresh token
        this.oauth2Client.setCredentials({
            refresh_token: process.env.GOOGLE_REFRESH_TOKEN
        });

        this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
    }

    /**
     * Create a calendar event for a booking
     * @param {Object} bookingData - Booking information from form
     * @returns {Object} Created event with meeting link
     */
    async createBookingEvent(bookingData) {
        const { name, email, phone, company, date, time, timezone, notes } = bookingData;

        // Parse date and time into ISO format
        const startDateTime = this.parseDateTime(date, time, timezone);
        const endDateTime = new Date(startDateTime.getTime() + 30 * 60000); // 30 min meeting

        const event = {
            summary: `Blosm Demo Consultation - ${company}`,
            description: this.buildEventDescription(bookingData),
            start: {
                dateTime: startDateTime.toISOString(),
                timeZone: timezone,
            },
            end: {
                dateTime: endDateTime.toISOString(),
                timeZone: timezone,
            },
            attendees: [
                { email: email, displayName: name },
                { email: 'scott@blosm.dev', displayName: 'Scott Sharples' }
            ],
            conferenceData: {
                createRequest: {
                    requestId: `blosm-${Date.now()}`,
                    conferenceSolutionKey: { type: 'hangoutsMeet' }
                }
            },
            reminders: {
                useDefault: false,
                overrides: [
                    { method: 'email', minutes: 24 * 60 }, // 1 day before
                    { method: 'popup', minutes: 30 }, // 30 min before
                ],
            },
        };

        try {
            const response = await this.calendar.events.insert({
                calendarId: 'primary',
                resource: event,
                conferenceDataVersion: 1,
                sendUpdates: 'all' // Send calendar invite to attendees
            });

            return {
                success: true,
                eventId: response.data.id,
                meetingLink: response.data.hangoutLink,
                calendarLink: response.data.htmlLink,
                startTime: response.data.start.dateTime,
                endTime: response.data.end.dateTime
            };
        } catch (error) {
            console.error('Google Calendar Error:', error);
            throw new Error(`Failed to create calendar event: ${error.message}`);
        }
    }

    /**
     * Parse date and time strings into Date object
     * @param {string} date - Date in YYYY-MM-DD format
     * @param {string} time - Time in HH:MM format
     * @param {string} timezone - IANA timezone string
     * @returns {Date} Parsed date object
     */
    parseDateTime(date, time, timezone) {
        const [year, month, day] = date.split('-').map(Number);
        const [hours, minutes] = time.split(':').map(Number);

        // Create date in specified timezone
        const dateTimeString = `${date}T${time}:00`;
        return new Date(dateTimeString);
    }

    /**
     * Build event description with booking details
     * @param {Object} bookingData - Booking information
     * @returns {string} Formatted description
     */
    buildEventDescription(bookingData) {
        const { name, email, phone, company, notes } = bookingData;

        let description = `Demo Website Consultation\n\n`;
        description += `Business: ${company}\n`;
        description += `Contact: ${name}\n`;
        description += `Email: ${email}\n`;
        if (phone) description += `Phone: ${phone}\n`;
        if (notes) description += `\nNotes:\n${notes}\n`;
        description += `\n---\n`;
        description += `This meeting was scheduled through the Blosm demo website preview.\n`;
        description += `Demo URL: https://${company.toLowerCase().replace(/\s+/g, '-')}.blosm.dev\n`;

        return description;
    }

    /**
     * Cancel a calendar event
     * @param {string} eventId - Google Calendar event ID
     * @returns {Object} Cancellation result
     */
    async cancelEvent(eventId) {
        try {
            await this.calendar.events.delete({
                calendarId: 'primary',
                eventId: eventId,
                sendUpdates: 'all'
            });

            return { success: true, message: 'Event cancelled successfully' };
        } catch (error) {
            console.error('Cancel Event Error:', error);
            throw new Error(`Failed to cancel event: ${error.message}`);
        }
    }

    /**
     * Check for scheduling conflicts
     * @param {string} date - Date in YYYY-MM-DD format
     * @param {string} time - Time in HH:MM format
     * @param {string} timezone - IANA timezone string
     * @returns {boolean} True if time slot is available
     */
    async checkAvailability(date, time, timezone) {
        const startDateTime = this.parseDateTime(date, time, timezone);
        const endDateTime = new Date(startDateTime.getTime() + 30 * 60000);

        try {
            const response = await this.calendar.events.list({
                calendarId: 'primary',
                timeMin: startDateTime.toISOString(),
                timeMax: endDateTime.toISOString(),
                singleEvents: true,
            });

            // If no events found, slot is available
            return response.data.items.length === 0;
        } catch (error) {
            console.error('Check Availability Error:', error);
            // If we can't check, assume it's available
            return true;
        }
    }
}

module.exports = GoogleCalendarService;
