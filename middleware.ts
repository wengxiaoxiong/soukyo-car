import createMiddleware from 'next-intl/middleware';
import {locales} from './i18n';

export default createMiddleware({
  // 支持的语言列表
  locales,
  
  // 默认语言
  defaultLocale: 'zh',
  
  // 语言检测策略
  localeDetection: true,
  
  // 路径名配置
  pathnames: {
    '/': '/',
    '/vehicles': '/vehicles',
    '/packages': '/packages',
    '/stores': '/stores',
    '/orders': '/orders',
    '/booking': '/booking',
    '/about': '/about',
    '/contact': '/contact'
  }
});

export const config = {
  // 匹配所有路径，除了以下路径：
  // - API路由 (/api)
  // - Next.js内部路径 (/_next)
  // - 静态文件 (不包含文件扩展名的路径)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};