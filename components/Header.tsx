"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { User, Menu, X } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector"

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4 md:gap-12">
            <h1 className="text-lg md:text-xl font-bold">
              <Image src="/logo.png" alt="Soukyo租车" width={100} height={100} />
            </h1>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#" className="text-gray-600 hover:text-gray-900">首页</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">车型</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">门店</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">关于我们</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <Button className="!rounded-button whitespace-nowrap">
              <User className="w-4 h-4 mr-2" />
              登录
            </Button>
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
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}; 