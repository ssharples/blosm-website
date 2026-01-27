export const COMPANY = {
  name: 'Blosm',
  legalName: 'Blosm Development',
  // Hero headline (ATTENTION) - 10 words, clear value prop
  tagline: 'Ship Products Fast Without Sacrificing Quality',
  // Subhead (transformation) - before → after
  description:
    'Turn your idea into a live, revenue-generating product in weeks, not months. Modern tech that actually works.',
  // Above-the-fold CTA
  primaryCTA: 'Start Your Project',
  contact: {
    email: 'scott@blosm.dev',
  },
} as const

export const NAVIGATION = {
  main: [
    { label: 'Services', href: '/services' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
} as const

// INTEREST section - outcome-focused, not tech-focused
export const SERVICES = [
  {
    id: 'fullstack',
    name: 'From Idea to Deployed Product',
    description:
      'Launch complete applications, not half-finished MVPs. We handle everything so you can focus on customers, not code.',
    icon: 'Layers',
  },
  {
    id: 'react',
    name: 'Apps That Load Fast & Convert',
    description:
      'Lightning-fast interfaces that keep users engaged. Every millisecond counts when it comes to conversions.',
    icon: 'Zap',
  },
  {
    id: 'backend',
    name: 'Reliable Infrastructure That Scales',
    description:
      'Build on foundations that grow with you. From 100 to 100,000 users without breaking a sweat.',
    icon: 'Server',
  },
  {
    id: 'database',
    name: 'Data Architecture That Performs',
    description:
      'Smart database design means fast queries today and easy changes tomorrow. No technical debt.',
    icon: 'Database',
  },
  {
    id: 'responsive',
    name: 'Beautiful On Every Device',
    description:
      'Your users are on mobile. Your app should be perfect there. Responsive by default, stunning everywhere.',
    icon: 'Smartphone',
  },
  {
    id: 'performance',
    name: 'Speed That Drives Revenue',
    description:
      'Faster sites convert better. We optimize every interaction so your users stay engaged and take action.',
    icon: 'Gauge',
  },
  {
    id: 'ai',
    name: 'AI Features That Add Value',
    description:
      'Smart automation and AI capabilities that solve real problems, not buzzword features.',
    icon: 'Brain',
  },
] as const

// Social proof - positioned after Services (INTEREST) to build DESIRE
export const STATS = [
  { value: 50, suffix: '+', label: 'Products Shipped' },
  { value: 160, suffix: 'K+', label: 'Users Served' },
  { value: 8, suffix: '+', label: 'Years Building' },
] as const

// DESIRE section - proof with outcome focus
export const CASE_STUDIES = [
  {
    id: 'chained-events',
    name: 'Chained Events',
    subtitle: 'From Spreadsheet Chaos to 160K Users',
    description:
      'Replaced manual spreadsheets with a real-time management platform that handles event staffing for major UK festivals.',
    challenge:
      'Managing 160,000+ festival attendees with spreadsheets caused constant errors, delays, and frustrated staff.',
    solution:
      'Built a unified platform with real-time updates, automated scheduling, and mobile-first design for on-site teams.',
    results: [
      'Eliminated manual scheduling errors completely',
      'Saved 20+ hours per event in admin time',
      '160,000+ users managed seamlessly',
      'Staff can now manage everything from their phones',
    ],
    tech: ['React', 'TanStack Start', 'Convex', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    image: '/images/case-studies/chained-events.jpg',
    href: '/case-studies/chained-events',
  },
  {
    id: 'forever-faux',
    name: 'Forever Faux Wreaths',
    subtitle: 'Sales Up 3x With Custom E-Commerce',
    description:
      'Transformed a small craft business into a thriving online store with a platform that showcases products beautifully and converts.',
    challenge:
      'Beautiful handcrafted products were not selling because the old website did not do them justice.',
    solution:
      'Custom e-commerce platform with stunning galleries, smooth checkout, and admin tools that make management effortless.',
    results: [
      '3x increase in monthly sales',
      'Customer compliments on site quality daily',
      'Order management reduced from hours to minutes',
      'Mobile conversion rate doubled',
    ],
    tech: ['Next.js', 'Stripe', 'Tailwind CSS', 'Postgres', 'Vercel'],
    image: '/images/case-studies/forever-faux.jpg',
    href: '/case-studies/forever-faux',
  },
] as const

export const TESTIMONIALS = [
  {
    quote:
      'Scott transformed our entire operation. What was once chaos with spreadsheets is now a streamlined system our whole team loves using. The real-time updates alone have saved us countless hours.',
    name: 'Tom',
    company: 'Chained Events',
    role: 'Director',
  },
  {
    quote:
      'The attention to detail was incredible. Every interaction feels polished, and our customers constantly compliment the site. Sales have increased significantly since launch.',
    name: 'Sarah',
    company: 'Forever Faux Wreaths',
    role: 'Owner',
  },
  {
    quote:
      'Working with Blosm was refreshingly straightforward. Clear communication, realistic timelines, and the final product exceeded our expectations. Highly recommended.',
    name: 'James',
    company: 'Tech Startup',
    role: 'CTO',
  },
] as const

export const ABOUT = {
  intro: `I'm Scott, a full-stack developer with 8+ years of experience building web applications that actually work.`,
  story: `I started Blosm because I was tired of seeing businesses struggle with outdated tech and overpriced agencies. My philosophy is simple: build fast, ship often, and never compromise on quality.

I specialize in React, Next.js, and modern backends like Convex. But technology is just a tool — what matters is solving real problems for real businesses.

Whether you need a startup MVP in weeks or want to modernize a legacy system, I bring the same level of dedication to every project.`,
  expertise: [
    'React & Next.js',
    'TypeScript',
    'Convex & Real-time Databases',
    'Node.js & APIs',
    'Tailwind CSS',
    'Framer Motion',
    'AI Integration',
    'Performance Optimization',
  ],
} as const
