# Blosm Company Website

Professional website for Blosm with integrated booking API for demo website consultations.

---

## Overview

This is the Blosm company website built using the web agency template. It includes:

- **Frontend**: Static HTML pages explaining Blosm's automated website generation service
- **Backend**: Vercel serverless function for booking API (`/api/booking`)
- **Integration**: Google Calendar + Resend email for booking confirmations

---

## Structure

```
blosm-website/
├── index.html              # Homepage
├── examples.html           # Portfolio of website examples
├── css/                    # Stylesheets
├── js/                     # JavaScript
├── images/                 # Images and assets
├── fonts/                  # Font files
├── api/                    # Vercel serverless functions
│   ├── booking.js          # Booking API endpoint
│   ├── google-calendar.js  # Google Calendar integration
│   ├── resend-email.js     # Email service
│   └── email-template.html # HTML email template
├── package.json            # Dependencies
├── vercel.json             # Vercel configuration
└── README.md               # This file
```

---

## Pages

### Homepage (`index.html`)
- Hero banner with value proposition
- How It Works section (3-step process)
- Pricing section (transparent pricing)
- Contact section

### Examples (`examples.html`)
- Portfolio grid showcasing 18+ industry templates
- Architecture, Dental, Law, Restaurant, etc.

---

## Features

✓ **Modern Design**: Professional web agency template
✓ **Responsive**: Mobile-optimized layout
✓ **Fast**: Static site with serverless API
✓ **SEO Optimized**: Meta tags and semantic HTML
✓ **Booking System**: Integrated Google Calendar + Email confirmations

---

## Local Development

### 1. Install Dependencies

```bash
cd /Users/dev/demo-generator/blosm-website
npm install
```

### 2. Set Up Environment Variables

Create `.env` file (copy from `.env.example`):

```bash
# Google Calendar Integration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REFRESH_TOKEN=your-google-refresh-token
GOOGLE_REDIRECT_URI=http://blosm.dev/api/auth/google/callback

# Resend Email Service
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=hello@updates.blosm.dev
```

### 3. Run Local Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

---

## Deployment to Vercel

### Prerequisites

- Vercel account (free tier works)
- Domain `blosm.dev` configured in Vercel
- Environment variables ready

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy

```bash
cd /Users/dev/demo-generator/blosm-website
vercel
```

Follow the prompts:
- **Set up and deploy?** Yes
- **Which scope?** Choose your account
- **Link to existing project?** No
- **Project name?** blosm
- **Directory?** ./ (current directory)

### Step 4: Configure Environment Variables

```bash
# Add each environment variable
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add GOOGLE_REFRESH_TOKEN
vercel env add GOOGLE_REDIRECT_URI
vercel env add RESEND_API_KEY
vercel env add RESEND_FROM_EMAIL
```

When prompted, select:
- **Environment**: Production
- **Enter value**: Paste the value from your `.env` file

### Step 5: Deploy to Production

```bash
vercel --prod
```

Your website will be available at:
- Default: `https://blosm.vercel.app`
- Custom domain: `https://blosm.dev` (after DNS configuration)

### Step 6: Configure Custom Domain

In Vercel Dashboard:
1. Go to Project Settings → Domains
2. Add domain: `blosm.dev`
3. Follow DNS configuration instructions
4. Add CNAME record in Hostinger DNS

---

## API Endpoint

### Booking API

**Endpoint**: `POST https://blosm.dev/api/booking`

**Request**:
```json
{
  "business_id": "notion-page-id",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "company": "Acme Corp",
  "date": "2025-11-01",
  "time": "14:00",
  "timezone": "America/New_York",
  "notes": "Looking forward to the demo!"
}
```

**Response (Success)**:
```json
{
  "success": true,
  "message": "Booking confirmed! Check your email for details.",
  "data": {
    "eventId": "abc123xyz",
    "meetingLink": "https://meet.google.com/xyz-abc-def",
    "calendarLink": "https://calendar.google.com/event?id=...",
    "startTime": "2025-11-01T14:00:00-05:00",
    "emailSent": true
  }
}
```

**Response (Error)**:
```json
{
  "success": false,
  "error": "Validation failed",
  "details": ["Valid email is required"]
}
```

---

## Testing

### Test Locally

```bash
# Start local server
npm run dev

# In another terminal, test API
curl -X POST http://localhost:3000/api/booking \
  -H "Content-Type: application/json" \
  -d '{
    "business_id": "test-123",
    "name": "Test User",
    "email": "scott@blosm.dev",
    "company": "Test Corp",
    "date": "2025-11-01",
    "time": "14:00",
    "timezone": "America/New_York"
  }'
```

### Test in Production

```bash
curl -X POST https://blosm.dev/api/booking \
  -H "Content-Type: application/json" \
  -d '{
    "business_id": "test-123",
    "name": "Test User",
    "email": "scott@blosm.dev",
    "company": "Test Corp",
    "date": "2025-11-01",
    "time": "14:00",
    "timezone": "America/New_York"
  }'
```

Check:
1. Scott's Google Calendar for new event
2. Email at `scott@blosm.dev` for confirmation

---

## Customization

### Change Brand Colors

Edit inline styles in `index.html` and `examples.html`:

```html
<!-- Current: Purple gradient -->
<style>
  .text-base-color { color: #a78bfa; }
  .bg-base-color { background-color: #a78bfa; }
</style>

<!-- Change to blue: -->
<style>
  .text-base-color { color: #60a5fa; }
  .bg-base-color { background-color: #60a5fa; }
</style>
```

### Update Pricing

Edit pricing section in `index.html`:

```html
<!-- Setup fee -->
<h2 class="fw-600 mb-0 text-dark-gray">$299<span class="fs-18 ms-5px">USD</span></h2>

<!-- Hosting -->
<h2 class="fw-600 mb-0 text-dark-gray">$29<span class="fs-18 ms-5px">USD/month</span></h2>
```

### Add More Examples

Edit `examples.html` portfolio grid:

```html
<!-- Add new portfolio item -->
<li class="grid-item transition-inner-all">
    <div class="portfolio-box">
        <div class="portfolio-image bg-medium-gray border-radius-6px">
            <a href="#"><img src="https://placehold.co/800x635" alt="New industry" /></a>
        </div>
        <div class="portfolio-caption pt-35px pb-35px">
            <a href="#" class="text-dark-gray fw-600">Business Name</a>
            <span class="d-inline-block align-middle w-10px separator-line-1px bg-light-gray ms-10px me-10px"></span>
            <div class="d-inline-block">Industry</div>
        </div>
    </div>
</li>
```

---

## Troubleshooting

### Issue: API endpoint returns 404

**Solution**: Ensure `vercel.json` is configured correctly and redeploy:
```bash
vercel --prod
```

### Issue: Environment variables not working

**Solution**: Check Vercel dashboard → Settings → Environment Variables. Make sure variables are set for Production environment and redeploy.

### Issue: Calendar events not creating

**Solution**:
1. Check Google Calendar API is enabled in GCP console
2. Verify refresh token is valid
3. Check Vercel function logs: `vercel logs`

### Issue: Emails not sending

**Solution**:
1. Verify Resend API key is valid
2. Check sender email `hello@updates.blosm.dev` is verified in Resend
3. Check spam folder

---

## Next Steps

1. **Deploy to Vercel** following instructions above
2. **Configure DNS** to point `blosm.dev` to Vercel
3. **Test booking flow** end-to-end
4. **Update demo sites** to use new API endpoint
5. **Add analytics** (Google Analytics, Plausible, etc.)

---

## Support

**Questions?**
- Email: scott@blosm.dev
- Website: https://blosm.dev

---

## License

© 2025 Blosm. All rights reserved.
