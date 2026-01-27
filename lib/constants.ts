export const COMPANY = {
  name: 'Blosm',
  legalName: 'Blosm Development',
  tagline: 'Full-Stack Development for Any Challenge',
  description:
    'From startup MVPs to enterprise platforms — we build scalable, modern web applications that drive results.',
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

export const SERVICES = [
  {
    id: 'fullstack',
    name: 'Full-Stack Web Development',
    description:
      'End-to-end development from database to deployment. We handle the entire stack so you can focus on your business.',
    icon: 'Layers',
  },
  {
    id: 'react',
    name: 'React & Next.js',
    description:
      'Modern, performant frontends built with React and Next.js. Server components, app router, and the latest patterns.',
    icon: 'Zap',
  },
  {
    id: 'backend',
    name: 'Backend & API Development',
    description:
      'Robust APIs and backend services. REST, GraphQL, real-time subscriptions — whatever your project needs.',
    icon: 'Server',
  },
  {
    id: 'database',
    name: 'Database Design',
    description:
      'From Convex to Postgres to MongoDB. We design schemas that scale and queries that perform.',
    icon: 'Database',
  },
  {
    id: 'responsive',
    name: 'Mobile-Responsive Design',
    description:
      'Beautiful interfaces that work flawlessly on every device. Mobile-first, accessible, and pixel-perfect.',
    icon: 'Smartphone',
  },
  {
    id: 'performance',
    name: 'Performance Optimization',
    description:
      'Speed matters. We optimize load times, Core Web Vitals, and runtime performance for the best user experience.',
    icon: 'Gauge',
  },
  {
    id: 'ai',
    name: 'AI & Automation',
    description:
      'Integrate AI capabilities into your applications. LLMs, automation workflows, and intelligent features.',
    icon: 'Brain',
  },
] as const

export const STATS = [
  { value: 50, suffix: '+', label: 'Projects Delivered' },
  { value: 8, suffix: '+', label: 'Years Experience' },
  { value: 15, suffix: '+', label: 'Technologies Mastered' },
] as const

export const CASE_STUDIES = [
  {
    id: 'chained-events',
    name: 'Chained Events',
    subtitle: 'Admin Hub',
    description:
      'A comprehensive event staffing management platform with real-time scheduling, stock management, and multi-portal architecture.',
    challenge:
      'Chained Events needed to modernize their operations from spreadsheets to a unified platform that could handle 160,000+ festival attendees.',
    solution:
      'Built a multi-portal system: Admin Hub for management, Staff Portal for workers, and Marketing Website. Real-time Convex database for live updates, TanStack Start for modern routing.',
    results: [
      'Real-time staff scheduling across multiple events',
      'Automated stock tracking and reordering',
      'Mobile-first design for on-site staff',
      '3 integrated portals sharing a single database',
    ],
    tech: ['React', 'TanStack Start', 'Convex', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    image: '/images/case-studies/chained-events.jpg',
    href: '/case-studies/chained-events',
  },
  {
    id: 'forever-faux',
    name: 'Forever Faux Wreaths',
    subtitle: 'E-Commerce Platform',
    description:
      'A beautiful e-commerce store for handcrafted artificial wreaths with seamless checkout and order management.',
    challenge:
      'Forever Faux needed an online presence that matched the quality of their handcrafted products, with easy product management and order tracking.',
    solution:
      'Built a custom e-commerce platform with a stunning product showcase, integrated Stripe payments, and an admin dashboard for order management.',
    results: [
      'Beautiful product galleries with zoom',
      'Seamless Stripe checkout integration',
      'Admin dashboard for order management',
      'SEO-optimized for local searches',
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
