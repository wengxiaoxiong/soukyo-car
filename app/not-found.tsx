import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FeaturedPackages } from '@/components/FeaturedPackages';
import { Home, Package } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 404 错误区域 */}
      <div className="max-w-4xl mx-auto pt-16 pb-8 px-4 text-center">
        <div className="mb-8">
          {/* 404 大标题 */}
          <h1 className="text-8xl md:text-9xl font-bold text-gray-300 mb-4">
            404
          </h1>
          
          {/* 错误信息 */}
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              找不到您要的页面
            </h2>
            <p className="text-lg text-gray-600 mb-2">
              很抱歉，您要访问的页面可能已被删除或URL输入有误。
            </p>
            <p className="text-base text-gray-500">
              您可以查看下方的推荐套餐，或者返回首页。
            </p>
          </div>

          {/* 返回首页按钮 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                <Home className="w-5 h-5 mr-2" />
                返回首页
              </Button>
            </Link>
            
            <Link href="/packages">
              <Button variant="outline" size="lg" className="px-8 py-3">
                <Package className="w-5 h-5 mr-2" />
                查看所有套餐
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 推荐套餐区域 */}
      <div className="border-t border-gray-200">
        <FeaturedPackages />
      </div>
    </div>
  );
} 