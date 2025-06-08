/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      // 仅在开发模式下启用 Turbopack
      enabled: process.env.NODE_ENV === 'development'
    }
  },
  // 配置图片域名
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ai-public.mastergo.com',
      },
      {
        protocol: 'https',
        hostname: '**.vercel-storage.com',
      }
    ],
  },
  // 严格模式
  reactStrictMode: true,
  // 启用 SWC 编译器
  swcMinify: true,
  // 输出独立文件以便部署
  output: 'standalone'
};

module.exports = nextConfig; 