/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'vercel.app'],
    unoptimized: true
  },
}

module.exports = nextConfig 