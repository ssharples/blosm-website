/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Allow serving static HTML files alongside Next.js
  async rewrites() {
    return {
      beforeFiles: [
        // Serve existing static HTML files
        {
          source: '/',
          destination: '/index.html',
        },
        {
          source: '/examples',
          destination: '/examples.html',
        },
      ],
    }
  },

  // Configure images for Payload media
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
    ],
  },

  // Webpack config for Payload
  webpack: (config) => {
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx'],
    }
    return config
  },
}

export default nextConfig
