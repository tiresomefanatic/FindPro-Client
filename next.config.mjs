
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
      protocol: 'https',
      hostname: 'files.edgestore.dev',
      port: '3000',
      pathname: 'files.edgestore.dev/**'
      },
    ],
  },
  env: {
    customKey: 'my-value',
  },
};



export default nextConfig;
