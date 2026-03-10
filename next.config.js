/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@react-three/drei', '@react-three/fiber', 'framer-motion'],
  },
  webpack: (config) => {
    config.externals = config.externals || []
    return config
  },
  images: {
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig
