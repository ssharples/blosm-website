/** @type {import('next').NextConfig} */
const nextConfig = {
  // Serve static HTML files
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/', destination: '/index.html' },
        { source: '/examples', destination: '/examples.html' },
      ],
    }
  },
}

export default nextConfig
