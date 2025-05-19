import type { NextConfig } from "next";
import dotenv from 'dotenv'
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../server/.env") });

const backendUrl = process.env.BACKEND_URL;

if (!backendUrl) {
  throw new Error("missing BACKEND_URL in .env file");
}

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: `${process.env.BACKEND_URL}/api/auth/:path*`,
      },
      {
        source: '/api/:path*',
        destination: `${process.env.BACKEND_URL}/api/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/a/**',
      }
    ],
  },
  env: {
    BACKEND_URL: process.env.BACKEND_URL,
  },
};

export default nextConfig;
