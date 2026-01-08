import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
    ],
    qualities: [75, 90],
  },
  
  // Enable detailed error logging in production
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  
};

export default nextConfig;
