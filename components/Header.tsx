"use client"

import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
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
import { LanguageSelector } from "@/components/LanguageSelector"

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();

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
              <Link href="/" className="text-gray-600 hover:text-gray-900">首页</Link>
              <Link href="/vehicle" className="text-gray-600 hover:text-gray-900">车型</Link>
              <Link href="/store" className="text-gray-600 hover:text-gray-900">门店</Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900">关于我们</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector />

            {/* 认证状态 */}
            {status === 'loading' ? (
              <Button disabled className="!rounded-button whitespace-nowrap">
                加载中...
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
                    <p className="text-sm font-medium">{session.user.name || '用户'}</p>
                    <p className="text-xs text-gray-500">{session.user.email}</p>
                    {session.user.role === 'ADMIN' && <div className="flex items-center mt-1">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        {session.user.role}
                      </span>
                    </div>}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/orders" className="flex items-center w-full">
                      <Settings className="w-4 h-4 mr-2" />
                      我的订单
                    </Link>
                  </DropdownMenuItem>

                  {session.user.role === 'ADMIN' && (
                    <DropdownMenuItem>
                      <Link href="/admin" className="flex items-center w-full">
                        <Shield className="w-4 h-4 mr-2" />
                        管理后台
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="w-4 h-4 mr-2" />
                    退出登录
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // 未登录用户
              <div className="flex items-center gap-2">
                <Link href="/auth/signin">
                  <Button variant="default" className="!rounded-button whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white">
                    登录查看更多
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
              <a href="#" className="text-gray-600 hover:text-gray-900 py-2">首页</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 py-2">车型</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 py-2">门店</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 py-2">关于我们</a>

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
                  {session.user.role === 'ADMIN' && (
                    <Link href="/admin" className="block py-2 text-gray-600 hover:text-gray-900">
                      管理后台
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="block py-2 text-gray-600 hover:text-gray-900 text-left"
                  >
                    退出登录
                  </button>
                </div>
              ) : (
                <div className="border-t pt-4 mt-4 space-y-2">
                  <Link href="/auth/signin" className="block py-2 text-gray-600 hover:text-gray-900">
                    登录
                  </Link>

                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}; 