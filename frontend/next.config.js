/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // Disable static optimization for standalone build
  swcMinify: true,
};

module.exports = nextConfig;
