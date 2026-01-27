import type { Metadata } from 'next'
import './globals.css'
import { manrope, outfit } from '@/lib/fonts'
import { SplashCursor } from '@/components/animations/splash-cursor'
import { Header } from '@/components/layout/header'

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
    <html lang="en" className={`dark ${manrope.variable} ${outfit.variable}`}>
      <body className="font-sans bg-black text-white">
        <SplashCursor />
        <Header />
        {children}
      </body>
    </html>
  )
}
