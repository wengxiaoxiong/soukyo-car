"use client"

import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from 'next/image';
import Link from 'next/link';
import { User, Menu, X, LogOut, Settings, Shield } from "lucide-react";
import LanguageSelector from "@/components/LanguageSelector";
import { NotificationCenter } from "@/components/NotificationCenter";
import { NotificationMobileMenu } from "@/components/NotificationMobileMenu";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();

  // 检测当前页面
  const isCurrentPage = (path: string) => {
    const currentPath = pathname.replace(`/${locale}`, '') || '/';
    return currentPath === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4 md:gap-12">
            <h1 className="text-lg md:text-xl font-bold">

              <Link href="/">
                <Image src="/logo.png" alt="Soukyo租车" width={100} height={100} />
              </Link>
            </h1>
            <nav className="hidden md:flex items-center gap-8">
              <Link 
                href={`/${locale}`} 
                className={`transition-colors duration-200 ${
                  isCurrentPage('/') 
                    ? 'text-gray-900 font-medium' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t('common.home')}
              </Link>
              <Link 
                href={`/${locale}/package`} 
                className={`transition-colors duration-200 ${
                  isCurrentPage('/package') 
                    ? 'text-gray-900 font-medium' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t('navigation.packages')}
              </Link>
              <Link 
                href={`/${locale}/store`} 
                className={`transition-colors duration-200 ${
                  isCurrentPage('/store') 
                    ? 'text-gray-900 font-medium' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t('navigation.stores')}
              </Link>
              <Link 
                href={`/${locale}/about`} 
                className={`transition-colors duration-200 ${
                  isCurrentPage('/about') 
                    ? 'text-gray-900 font-medium' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t('common.about')}
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector />

            {/* 通知功能 */}
            {session?.user && <NotificationCenter />}

            {/* 认证状态 */}
            {status === 'loading' ? (
              <Button disabled className="!rounded-button whitespace-nowrap">
                {t('common.loading')}
              </Button>
            ) : session?.user ? (
              // 已登录用户
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="!rounded-button flex items-center gap-2 px-3">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || '用户头像'}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                    <span className="hidden md:inline">
                      {session.user.name || session.user.email}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{session.user.name || t('common.name')}</p>
                    <p className="text-xs text-gray-500">{session.user.email}</p>
                    {session.user.role === 'ADMIN' && <div className="flex items-center mt-1">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        {session.user.role}
                      </span>
                    </div>}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href={`/${locale}/orders`} className="flex items-center w-full">
                      <Settings className="w-4 h-4 mr-2" />
                      {t('navigation.orders')}
                    </Link>
                  </DropdownMenuItem>

                  {session.user.role === 'ADMIN' && (
                    <DropdownMenuItem>
                      <Link href={`/${locale}/admin`} className="flex items-center w-full">
                        <Shield className="w-4 h-4 mr-2" />
                        {t('navigation.admin')}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('auth.sign_out')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // 未登录用户
              <div className="flex items-center gap-2">
                <Link href={`/${locale}/auth/signin`}>
                  <Button variant="default" className="!rounded-button whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white">
                    {t('auth.sign_in')}
                  </Button>
                </Link>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden !rounded-button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-sm">
          <div className="max-w-[1440px] mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                href={`/${locale}`} 
                className={`py-2 transition-colors duration-200 ${
                  isCurrentPage('/') 
                    ? 'text-gray-900 font-medium' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t('common.home')}
              </Link>
              <Link 
                href={`/${locale}/package`} 
                className={`py-2 transition-colors duration-200 ${
                  isCurrentPage('/package') 
                    ? 'text-gray-900 font-medium' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t('navigation.packages')}
              </Link>
              <Link 
                href={`/${locale}/store`} 
                className={`py-2 transition-colors duration-200 ${
                  isCurrentPage('/store') 
                    ? 'text-gray-900 font-medium' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t('navigation.stores')}
              </Link>
              <Link 
                href={`/${locale}/about`} 
                className={`py-2 transition-colors duration-200 ${
                  isCurrentPage('/about') 
                    ? 'text-gray-900 font-medium' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t('common.about')}
              </Link>

              {/* 移动端通知 */}
              {session?.user && (
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center gap-2 py-2">
                    <NotificationMobileMenu />
                    <span className="text-gray-600">{t('notifications.title')}</span>
                  </div>
                </div>
              )}

              {/* 移动端认证菜单 */}
              {session?.user ? (
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || '用户头像'}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">
                      {session.user.name || session.user.email}
                    </span>
                  </div>
                  <Link href={`/${locale}/orders`} className="block py-2 text-gray-600 hover:text-gray-900">
                    {t('navigation.orders')}
                  </Link>
                  {session.user.role === 'ADMIN' && (
                    <Link href={`/${locale}/admin`} className="block py-2 text-gray-600 hover:text-gray-900">
                      {t('navigation.admin')}
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="block py-2 text-gray-600 hover:text-gray-900 text-left"
                  >
                    {t('auth.sign_out')}
                  </button>
                </div>
              ) : (
                <div className="border-t pt-4 mt-4 space-y-2">
                  <Link href={`/${locale}/auth/signin`} className="block py-2 text-gray-600 hover:text-gray-900">
                    {t('auth.sign_in')}
                  </Link>

                </div>
              )}
            </nav>
          </div>
        </div>
      )}
      
      {/* 滚动进度条 */}
      <ScrollProgressBar />
    </header>
  );
}; 