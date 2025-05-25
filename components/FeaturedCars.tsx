import React from 'react';
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { CarCard } from './CarCard';

export const FeaturedCars: React.FC = () => {
  const cars = [
    {
      name: 'Toyota Crown',
      type: '豪华轿车',
      price: '￥688',
      image: 'https://ai-public.mastergo.com/ai/img_res/e8ecc253a5e6100ab260268be804cff7.jpg',
      location: '成田机场可取还',
      seats: '5座',
      transmission: '自动档'
    },
    {
      name: 'Lexus RX',
      type: '中型SUV',
      price: '￥888',
      image: 'https://ai-public.mastergo.com/ai/img_res/b60edb48f6231afe2377abfabca6df06.jpg',
      location: '羽田机场可取还',
      seats: '5座',
      transmission: '自动档'
    },
    {
      name: 'Mercedes-Benz V-Class',
      type: '商务车',
      price: '￥1288',
      image: 'https://ai-public.mastergo.com/ai/img_res/bb3d7e5a7094b25349c48ee525d7fb60.jpg',
      location: '池袋店可取还',
      seats: '7座',
      transmission: '自动档'
    }
  ];

  return (
    <div className="bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12">推荐车型</h2>
        <div className="relative">
          {/* 移动端滚动指示 */}
          <div className="md:hidden mb-4 text-sm text-gray-500 flex items-center">
            <span>← 左右滑动查看更多 →</span>
          </div>
          {/* 滚动容器 */}
          <div className="flex overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-4 gap-6 md:gap-8 scrollbar-hide">
            {cars.map((car, index) => (
              <CarCard key={index} {...car} />
            ))}
            
            {/* "查看更多"卡片 */}
            <Card className="overflow-hidden flex-shrink-0 w-[280px] md:w-auto mx-2 last:mr-0 md:mx-0 bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center">
              <a href="#" className="p-6 flex flex-col items-center justify-center w-full h-full min-h-[380px] md:min-h-full">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <ChevronRight className="w-6 h-6 text-gray-500" />
                </div>
                <p className="text-lg font-medium text-gray-700">查看更多车型</p>
              </a>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}; 