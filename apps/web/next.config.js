/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@rewa/types', '@rewa/ui'],
  images: {
    domains: ['images.unsplash.com'],
  },
};

module.exports = nextConfig;
