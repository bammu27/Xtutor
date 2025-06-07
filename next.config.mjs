/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "www.google.com",
      },
    ],
  },
  experimental: {
    appDir: true, // 👈 This enables the /app directory support
  },
};



export default nextConfig;
