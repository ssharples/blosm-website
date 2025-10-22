/**
 * Blosm Booking API Endpoint (Vercel Serverless Function)
 * Handles booking form submissions from demo site popups
 */

const GoogleCalendarService = require('./google-calendar');
const ResendEmailService = require('./resend-email');

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
        // Parse booking data
        const bookingData = req.body;

        // Validate required fields
        const validation = validateBookingData(bookingData);
        if (!validation.valid) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: validation.errors
            });
        }

        // Initialize services
        const calendarService = new GoogleCalendarService();
        const emailService = new ResendEmailService();

        // Check if time slot is available
        const isAvailable = await calendarService.checkAvailability(
            bookingData.date,
            bookingData.time,
            bookingData.timezone
        );

        if (!isAvailable) {
            return res.status(409).json({
                success: false,
                error: 'Time slot not available',
                message: 'This time slot is already booked. Please select a different time.'
            });
        }

        // Create Google Calendar event
        const calendarEvent = await calendarService.createBookingEvent(bookingData);

        // Fetch business branding (if available)
        const businessBranding = {
            primaryColor: '#7c3aed',
            secondaryColor: '#a78bfa',
            accentColor: '#c4b5fd',
            logoUrl: ''
        };

        // Send confirmation email
        const emailResult = await emailService.sendConfirmationEmail(
            bookingData,
            calendarEvent,
            businessBranding
        );

        // Log successful booking
        console.log('Booking created successfully:', {
            business: bookingData.company,
            email: bookingData.email,
            eventId: calendarEvent.eventId,
            emailId: emailResult.emailId
        });

        // Return success response
        return res.status(200).json({
            success: true,
            message: 'Booking confirmed! Check your email for details.',
            data: {
                eventId: calendarEvent.eventId,
                meetingLink: calendarEvent.meetingLink,
                calendarLink: calendarEvent.calendarLink,
                startTime: calendarEvent.startTime,
                emailSent: emailResult.success
            }
        });

    } catch (error) {
        console.error('Booking Error:', error);

        return res.status(500).json({
            success: false,
            error: 'Failed to create booking',
            message: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

/**
 * Validate booking form data
 * @param {Object} data - Booking data from form
 * @returns {Object} Validation result
 */
function validateBookingData(data) {
    const errors = [];

    // Required fields
    if (!data.name || data.name.trim().length === 0) {
        errors.push('Name is required');
    }

    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Valid email is required');
    }

    if (!data.company || data.company.trim().length === 0) {
        errors.push('Company name is required');
    }

    if (!data.date || !isValidDate(data.date)) {
        errors.push('Valid date is required');
    }

    if (!data.time || !isValidTime(data.time)) {
        errors.push('Valid time is required');
    }

    if (!data.timezone || data.timezone.trim().length === 0) {
        errors.push('Timezone is required');
    }

    // Date must be in the future
    if (data.date && isValidDate(data.date)) {
        const selectedDate = new Date(data.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            errors.push('Date must be in the future');
        }
    }

    // Business hours validation (9 AM - 5 PM)
    if (data.time && isValidTime(data.time)) {
        const [hours, minutes] = data.time.split(':').map(Number);
        if (hours < 9 || hours >= 17) {
            errors.push('Time must be between 9:00 AM and 5:00 PM');
        }
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
 * Validate date format (YYYY-MM-DD)
 * @param {string} date - Date string
 * @returns {boolean} True if valid
 */
function isValidDate(date) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) return false;

    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
}

/**
 * Validate time format (HH:MM)
 * @param {string} time - Time string
 * @returns {boolean} True if valid
 */
function isValidTime(time) {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
}
