import type { Metadata } from 'next'

const siteUrl = 'https://blosm.dev'

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Blosm | Full-Stack Web Development Services',
    template: '%s | Blosm',
  },
  description:
    'Full-stack development for ambitious projects. React, Next.js, and modern backends. From startup MVPs to enterprise platforms.',
  keywords: [
    'web development',
    'full-stack developer',
    'React developer',
    'Next.js development',
    'Convex database',
    'TypeScript',
    'freelance developer',
    'startup MVP',
    'web application',
  ],
  authors: [{ name: 'Scott Sharples' }],
  creator: 'Blosm',
  publisher: 'Blosm',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: siteUrl,
    siteName: 'Blosm',
    title: 'Blosm | Full-Stack Web Development',
    description:
      'Full-stack development for ambitious projects. React, Next.js, and modern backends.',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Blosm - Full-Stack Web Development',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blosm | Full-Stack Web Development',
    description: 'Full-stack development for ambitious projects. React, Next.js, and modern backends.',
    images: ['/images/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export function generatePageMetadata(
  title: string,
  description: string,
  path: string = '/'
): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}${path}`,
    },
    twitter: {
      title,
      description,
    },
    alternates: {
      canonical: `${siteUrl}${path}`,
    },
  }
}

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Blosm',
  description: 'Full-stack web development services. React, Next.js, and modern backends.',
  url: siteUrl,
  email: 'scott@blosm.dev',
  areaServed: {
    '@type': 'Country',
    name: 'United Kingdom',
  },
  serviceType: ['Web Development', 'Full-Stack Development', 'React Development', 'Next.js Development'],
}
