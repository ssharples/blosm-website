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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
