# Blosm Website Redesign Research

## Current Issues
- Site feels "all over the place" - lacks cohesion and clear visual hierarchy
- CSS setup was broken (fixed with CDN temporarily)
- Animations not triggering properly (stats show 0+, blur text not revealing)
- Generic AI aesthetic - needs more distinctive, memorable design

## React Bits Components to Implement

### Text Animations (High Priority)
- **Split Text** - For hero headline reveal
- **Shiny Text** - For call-to-action buttons
- **Decrypted Text** - For tech-focused headings (creates intrigue)
- **Count Up** - For stats section (replace broken animation)
- **Scroll Reveal** - For section content reveals
- **Gradient Text** - For accent text

### Cursor & Interactions
- **Splash Cursor** - Creates memorable interactive experience
- **Magnet** - For buttons and CTAs
- **Click Spark** - Subtle feedback on clicks

### Cards & Components
- **Spotlight Card** - For services and case studies
- **Tilted Card** - For testimonials (3D tilt on hover)
- **Magic Bento** - Consider for services grid layout
- **Flowing Menu** - For navigation

### Backgrounds
- **Aurora** - Already using, but consider React Bits version for better performance
- **Hyperspeed** - Could use for page transitions
- **Beams** - Subtle light beam effects

## 2025 Design Trends to Apply

### 1. Bento Grid Layout
- Reorganize services into asymmetric bento boxes
- Different sizes = visual hierarchy
- More engaging than equal-sized cards

### 2. Bold, Expressive Typography
- Use distinctive display font (NOT Inter/Space Grotesk)
- Consider: Clash Display, Cabinet Grotesk, Satoshi, or custom variable font
- Large, impactful headlines
- Mix weights dramatically

### 3. Scroll-Triggered Storytelling
- Reveal content as user scrolls
- Create narrative flow through the page
- Each section should feel like a "scene"

### 4. Micro-Animations Everywhere
- Button hover states that delight
- Card entrance animations staggered
- Subtle background movement
- Cursor interactions

### 5. Full-Screen Hero
- Immersive opening experience
- Clear value proposition
- Single, strong CTA
- Background that moves/reacts

### 6. Dark Theme Done Right
- Pure black (#000) as base
- Accent colors that POP (pink/purple gradients)
- Careful use of transparency for depth
- Glows and light effects

## Design Direction: "Refined Tech Luxury"

**NOT:** Generic SaaS, corporate, or typical agency
**YES:** Premium, distinctive, memorable, technically impressive

### Color Palette
- Primary: Deep black (#000000)
- Accent 1: Electric pink (#ec4899 → #f472b6)
- Accent 2: Purple (#a855f7 → #8b5cf6)
- Accent 3: Cyan/blue for contrast (#06b6d4)
- Text: White (#ffffff) with gray variations

### Typography Suggestions
- Headlines: Clash Display or Cabinet Grotesk (bold, distinctive)
- Body: Satoshi or General Sans (clean, readable)
- Avoid: Inter, Space Grotesk, Roboto (overused)

## Page Structure Redesign

### Hero Section
1. Full viewport height
2. Aurora background (React Bits version)
3. Split Text animation for headline
4. Shiny Text for tagline
5. Magnet effect on CTA buttons
6. Splash Cursor for interactivity
7. Scroll indicator at bottom

### Services Section
1. Bento grid layout (asymmetric)
2. Spotlight Card effect on each
3. Icons with subtle animations
4. Staggered entrance on scroll

### Stats Section
1. Count Up component (React Bits) - MUST WORK
2. Electric Border around the section
3. Gradient text for numbers

### Case Studies Section
1. Tilted Card for project cards
2. Hover reveals more detail
3. Subtle parallax on images

### Testimonials Section
1. Horizontal scrolling carousel OR
2. Stacked cards with Bounce Cards effect
3. Quote marks with Gradient Text

### CTA Section
1. Full-width with Aurora background
2. Large, bold headline
3. Multiple contact options
4. Magnet effect on buttons

## Implementation Notes

### Install React Bits
```bash
npx shadcn@latest add "https://www.reactbits.dev/r/split-text"
npx shadcn@latest add "https://www.reactbits.dev/r/shiny-text"
npx shadcn@latest add "https://www.reactbits.dev/r/count-up"
npx shadcn@latest add "https://www.reactbits.dev/r/spotlight-card"
npx shadcn@latest add "https://www.reactbits.dev/r/magnet"
npx shadcn@latest add "https://www.reactbits.dev/r/splash-cursor"
npx shadcn@latest add "https://www.reactbits.dev/r/aurora"
```

### Fix Tailwind CSS Setup
- Remove Tailwind CDN (temporary fix)
- Set up Tailwind 4 properly OR downgrade to Tailwind 3
- Configure postcss correctly for ES modules

### Key Files to Update
- `app/layout.tsx` - Fonts, global cursor, proper CSS
- `app/page.tsx` - Page structure
- `components/sections/*` - All section components
- `tailwind.config.ts` - Proper configuration
- `globals.css` - Base styles, animations

## Success Criteria
1. ✅ Tailwind CSS working properly (not CDN)
2. ✅ All animations trigger correctly
3. ✅ Stats count up from 0 to target number
4. ✅ Distinctive design that doesn't look like AI slop
5. ✅ Memorable interactions (cursor, hover states)
6. ✅ Fast performance (no layout shift)
7. ✅ Mobile responsive
8. ✅ Builds successfully

---

## Marketing Best Practices (MUST APPLY)

### Page Structure (AIDA Framework)
**Attention** → **Interest** → **Desire** → **Action**
- Hero = Attention (bold headline, striking visual)
- Services/What We Build = Interest (show capability)
- Case Studies/Testimonials = Desire (proof it works)
- CTA Section = Action (clear next step)

### Psychology Principles
1. **Hick's Law** - ONE clear CTA per section, not multiple options
2. **Social Proof** - Stats, logos, testimonials prominently displayed
3. **Loss Aversion** - Frame around what they'll miss, not just gain
4. **Anchoring** - Show the value/transformation before asking for action

### CRO (Conversion Rate Optimization)
- **Headline**: 8-12 words max, crystal clear value prop
- **Subhead**: Shows the transformation (before → after)
- **Visual proof**: Add project screenshots or video
- **Trust signals**: Client logos, testimonial quotes, stats
- **CTA text**: Action-oriented ("Start Your Project" not "Submit")
- **Above fold**: Value prop + primary CTA visible without scrolling

### Copy Framework (PAS: Problem → Agitation → Solution)
Example for hero:
- Problem: "Your website isn't converting"
- Agitation: "Every day costs you customers"
- Solution: "We build web apps that drive results"

### Messaging Guidelines
Focus on OUTCOMES not features:
- ❌ "We use React and Next.js"
- ✅ "Apps that load fast and convert visitors"

- ❌ "Full-stack development services"
- ✅ "From idea to deployed product in weeks, not months"

- ❌ "Real-time backend with Convex"
- ✅ "Your data updates instantly, no refresh needed"

Keep copy punchy, benefit-focused, and transformation-oriented!
