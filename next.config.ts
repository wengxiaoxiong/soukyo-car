import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "0nrui4uhjcvewjzb.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "ai-public.mastergo.com",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
