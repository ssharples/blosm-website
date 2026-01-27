/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

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
