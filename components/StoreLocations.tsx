

import React from 'react';
import { StoreCard } from './StoreCard';
import { getActiveStores } from '@/app/actions/stores';


export const revalidate = 3600 // 每小时重新生成一次

export const StoreLocations: React.FC = async () => {
  const stores = await getActiveStores();

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-12 md:py-16">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12">门店网络</h2>
      <div className="relative">
        {/* 移动端滚动指示 */}
        <div className="md:hidden mb-4 text-sm text-gray-500 flex items-center">
          <span>← 左右滑动查看更多 →</span>
        </div>
        {/* 滚动容器 */}
        <div className="flex overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 scrollbar-hide">
          {stores.length > 0 ? (
            stores.map((store) => (
              <StoreCard key={store.id} {...store} />
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              暂无可用店面
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 