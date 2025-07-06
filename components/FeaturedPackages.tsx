import React from 'react';
import { Card } from "@/components/ui/card";
import { ChevronRight, Star, Zap, Package } from "lucide-react";
import { PackageCard } from './PackageCard';
import { getFeaturedPackages } from '@/lib/actions/packages';

export const FeaturedPackages: React.FC = async () => {
  const packages = await getFeaturedPackages();

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            <Star className="w-4 h-4" />
            <span>精选推荐</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            热门套餐
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            精心挑选的优质套餐，满足您不同的出行需求
          </p>
        </div>

        {/* Packages Grid */}
        <div className="relative">
          {/* 移动端滚动提示 */}
          {packages.length > 0 && (
            <div className="md:hidden mb-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm text-sm text-gray-500">
                <span>← 左右滑动查看更多 →</span>
              </div>
            </div>
          )}
          
          {/* 套餐卡片容器 */}
          <div className="flex overflow-x-auto pb-6 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 scrollbar-hide">
            {packages.length > 0 ? (
              <>
                {packages.map((pkg) => (
                  <PackageCard key={pkg.id} {...pkg} />
                ))}
                
                {/* "查看更多"卡片 */}
                <Card className="overflow-hidden flex-shrink-0 w-[300px] md:w-auto mx-2 first:ml-0 last:mr-0 md:mx-0 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                  <a href="/package" className="p-8 flex flex-col items-center justify-center w-full h-full min-h-[400px] text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <ChevronRight className="w-8 h-8 text-blue-600 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">查看更多套餐</h3>
                    <p className="text-gray-600 text-sm">发现更多适合您的套餐</p>
                    <div className="mt-4 flex items-center gap-2 text-blue-600 text-sm font-medium">
                      <Zap className="w-4 h-4" />
                      <span>立即探索</span>
                    </div>
                  </a>
                </Card>
              </>
            ) : (
              <div className="col-span-full text-center py-20">
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                  <Package className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">暂无推荐套餐</h3>
                <p className="text-gray-500 text-lg">管理员正在添加更多套餐信息</p>
              </div>
            )}
          </div>
        </div>

        {/* CTA Section */}
        {packages.length > 0 && (
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300">
              <span className="text-gray-600">还没找到心仪的套餐？</span>
              <a 
                href="/package" 
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200"
              >
                浏览全部套餐 →
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};