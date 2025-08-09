import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import {locales} from './i18n';

const intlMiddleware = createMiddleware({
  // 支持的语言列表
  locales,
  
  // 默认语言
  defaultLocale: 'ja',
  
  // 语言检测策略
  localeDetection: true
});

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // 对于管理员路径，直接使用默认的国际化中间件
  if (pathname.startsWith('/admin') || pathname.includes('/admin/')) {
    return intlMiddleware(request);
  }

  // 检查用户是否已登录
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  // 如果用户已登录且有语言偏好
  if (token && token.preferredLanguage) {
    const userLanguage = token.preferredLanguage;
    
    // 检查当前路径是否已经包含语言前缀
    const pathnameHasLocale = locales.some(
      (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    // 如果路径没有语言前缀或者语言前缀与用户偏好不匹配
    if (!pathnameHasLocale) {
      // 重定向到用户偏好语言
      return NextResponse.redirect(
        new URL(`/${userLanguage}${pathname}`, request.url)
      );
    } else {
      // 检查当前语言是否与用户偏好匹配
      const currentLocale = pathname.split('/')[1];
      if (currentLocale !== userLanguage && locales.includes(currentLocale as any)) {
        // 如果不匹配，重定向到用户偏好语言
        const newPathname = pathname.replace(`/${currentLocale}`, `/${userLanguage}`);
        return NextResponse.redirect(
          new URL(newPathname, request.url)
        );
      }
    }
  }

  // 使用默认的国际化中间件
  return intlMiddleware(request);
}

export const config = {
  // 匹配所有路径，除了以下路径：
  // - API路由 (/api)
  // - Next.js内部路径 (_next, _vercel等)
  // - 静态文件 (包含文件扩展名的路径)
  // - favicon.ico
  matcher: ['/((?!api|_next|_vercel|favicon.ico|.*\\..*).*)', '/']
};