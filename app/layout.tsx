import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'Blosm - Full-Stack Development Services',
  description: 'From startup MVPs to enterprise platforms — we build scalable, modern web applications that drive results.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
      </head>
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  )
}
