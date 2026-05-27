import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
      },
    ],
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    return [
      {
        source: '/api/prs/:path*',
        destination: `${apiUrl}/prs/:path*`,
      },
      {
        source: '/api/reviews/:path*',
        destination: `${apiUrl}/reviews/:path*`,
      },
      {
        source: '/api/analytics/:path*',
        destination: `${apiUrl}/analytics/:path*`,
      },
      {
        source: '/api/repos/:path*',
        destination: `${apiUrl}/repos/:path*`,
      },
    ]
  },
}

export default nextConfig
