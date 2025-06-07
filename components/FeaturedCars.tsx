import React from 'react';
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { CarCard } from './CarCard';
import { getFeaturedCars } from '@/lib/actions/cars';

export const FeaturedCars: React.FC = async () => {
  const cars = await getFeaturedCars();

  return (
    <div className="bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12">推荐车型</h2>
        <div className="relative">
          {/* 移动端滚动指示 */}
          {cars.length > 0 && (
            <div className="md:hidden mb-4 text-sm text-gray-500 flex items-center">
              <span>← 左右滑动查看更多 →</span>
            </div>
          )}
          
          {/* 滚动容器 */}
          <div className="flex overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-4 gap-6 md:gap-8 scrollbar-hide">
            {cars.length > 0 ? (
              <>
                {cars.map((car) => (
                  <CarCard key={car.id} {...car} />
                ))}
                
                {/* "查看更多"卡片 */}
                <Card className="overflow-hidden flex-shrink-0 w-[280px] md:w-auto mx-2 last:mr-0 md:mx-0 bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center pt-0">
                  <a href="/vehicle" className="p-6 flex flex-col items-center justify-center w-full h-full min-h-[380px] md:min-h-full">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <ChevronRight className="w-6 h-6 text-gray-500" />
                    </div>
                    <p className="text-lg font-medium text-gray-700">查看更多车型</p>
                  </a>
                </Card>
              </>
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">暂无推荐车型</p>
                <p className="text-gray-400 text-sm mt-2">管理员正在添加更多车辆信息</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 