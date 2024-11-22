import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Change to static export

   // Remove or comment out the static export option
  // output: 'export',
 // output: 'export',
  
  // Disable server-side features for static export
  images: {
    unoptimized: true
  },

  // Optional: Configure trailingSlash if you want
  trailingSlash: true,

  // Remove experimental server actions for static export
  // experimental: {
  //   serverActions: { ... }  // This won't work with static export
  // }
};

export default nextConfig;
