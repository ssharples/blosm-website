import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blosm - Website Modernization Services',
  description: 'We modernize outdated business websites using AI-powered automation. Beautiful, mobile-ready, and professionally designed.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  )
}
