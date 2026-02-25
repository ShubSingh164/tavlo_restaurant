import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * BACKEND INTEGRATION: API Proxy Rewrites
   * 
   * Proxies all frontend requests to /api/backend/* through to the NestJS backend.
   * This avoids CORS issues during development.
   * 
   * Example: /api/backend/auth/login → http://localhost:3000/auth/login
   * 
   * The backend URL is read from NEXT_PUBLIC_API_URL env variable (.env.local),
   * falling back to http://localhost:3000 if not set.
   */
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/:path*`,
      },
    ];
  },
};

export default nextConfig;
