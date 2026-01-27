import type { Metadata } from 'next'
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
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  )
}
