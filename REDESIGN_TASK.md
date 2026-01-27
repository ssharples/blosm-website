# Blosm Website Redesign Task

## Overview
Redesign the Blosm website based on the stunning Chained Events marketing site design. Transform it from a "quick landing pages" service to a "full-stack development services" offering.

## Reference Design
The Chained Events marketing site is located at:
`/home/clawdbot/clawd/projects/chained-events-portal/apps/marketing-website/`

Key design elements to adopt:
- Aurora gradient backgrounds with animated floating orbs
- Framer Motion animations throughout
- BlurText and GradientText animated components
- ScrollReveal for section entrances
- Magnet effect on buttons
- Modern dark theme with pink/blue accent gradients
- Clean, bold typography
- Animated grid backgrounds
- Stats bar with impressive numbers
- Testimonials section
- Clean services grid

## New Site Structure

### Homepage (`/`)
- **Hero Section**: "Full-Stack Development for Any Challenge"
  - Subheadline: "From startup MVPs to enterprise platforms — we build scalable, modern web applications"
  - CTA: "Start Your Project" / "View Our Work"
- **Services Grid**: Show key offerings
- **Stats Bar**: Projects delivered, years experience, technologies, etc.
- **Case Studies Preview**: Feature cards for 3 projects
- **Testimonials**: Client quotes
- **CTA Section**: Final call to action

### Services (`/services`)
- Full-Stack Web Development
- React/Next.js Applications
- Backend & API Development
- Database Design (Convex, Postgres, etc.)
- Mobile-Responsive Design
- Performance Optimization
- AI/Automation Integration

### Case Studies (`/case-studies`)
Create detailed case study pages for:

1. **Chained Events - Admin Hub**
   - Event staffing management platform
   - Real-time staff scheduling
   - Stock management system
   - Multi-portal architecture (staff, admin, marketing)
   - Tech: React, TanStack Start, Convex, TypeScript

2. **Swift App** (if details available)
   - Mobile application
   - Key features and outcomes

3. **Forever Faux Wreaths**
   - E-commerce platform
   - Product catalog
   - Shopping cart & checkout
   - Order management

### About (`/about`)
- Scott's story and expertise
- Technology stack expertise
- Working process

### Contact (`/contact`)
- Contact form that sends webhook to Clawdbot
- "Book a Call" option with Calendly or similar
- Email: scott@blosm.dev

## Technical Requirements

### Contact Form Webhook
The contact form should POST to a webhook that notifies Clawd (the AI assistant):

```typescript
// When form is submitted, POST to:
// Option 1: Use an API route that calls the Clawdbot gateway
// Option 2: Use a service like Make/Zapier/Pipedream to relay

// The webhook payload should include:
{
  name: string,
  email: string,
  company?: string,
  message: string,
  budget?: string,
  timeline?: string,
  submittedAt: string
}
```

For now, create an API route at `/api/contact` that:
1. Validates the form data
2. Sends an email notification to scott@blosm.dev
3. Returns success response

### Stack
- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- Framer Motion for animations
- Components from Chained Events design system where applicable

### Deployment
- Already configured for Vercel
- Auto-deploys from main branch

## Design Tokens (from Chained Events)

```css
/* Primary Colors */
--color-primary: #4BA3D3 (blue)
--color-secondary: #D82E8A (pink/magenta)

/* Gradients */
background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(75, 163, 211, 0.3), transparent)

/* Typography - Bold, modern */
/* Dark theme with subtle grid overlays */
```

## Copy Guidelines

### Tone
- Professional but approachable
- First-person where appropriate ("I build...")
- Focus on outcomes and results
- Avoid jargon, be clear about value

### Key Messages
- "Full-stack development for ambitious projects"
- "Modern tech stack, proven results"
- "From concept to production"
- "Building what others say is impossible"

## Deliverables
1. Complete redesigned website
2. Mobile responsive
3. All pages functional
4. Contact form working
5. Case studies with real content
6. Clean, maintainable code
7. Create PR with descriptive changes
8. Ready for production deployment

## After Completion
Once the PR is created, Clawd will:
1. Review the changes
2. Test locally if needed
3. Approve and merge to main
4. Vercel will auto-deploy
5. Notify Scott of completion
