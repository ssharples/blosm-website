import type { Metadata } from 'next'
import { RootLayout } from '@payloadcms/next/layouts'
import config from '@/payload.config'
import './styles.css'

export const metadata: Metadata = {
  title: 'Blosm CMS',
  description: 'Content management system for Blosm website',
}

const Layout = ({ children }: { children: React.ReactNode }) => (
  <RootLayout config={config}>{children}</RootLayout>
)

export default Layout
