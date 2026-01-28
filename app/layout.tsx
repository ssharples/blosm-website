import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Blosm - Software for the Event Industry',
  description: 'We build operational software for companies that run events — staffing, accreditation, stock management. Built by people who\'ve been in the production office at 2am.',
  keywords: ['event software', 'staffing management', 'accreditation system', 'stock management', 'event technology', 'festival software'],
  authors: [{ name: 'Blosm' }],
  openGraph: {
    title: 'Blosm - Software for the Event Industry',
    description: 'We build operational software for companies that run events — staffing, accreditation, stock management.',
    url: 'https://blosm.dev',
    siteName: 'Blosm',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Satoshi - refined sans-serif for body text */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap"
          rel="stylesheet"
        />
        {/* General Sans - bold geometric for display/headings */}
        <link
          href="https://api.fontshare.com/v2/css?f[]=general-sans@500,600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
