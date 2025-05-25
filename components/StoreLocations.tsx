import React from 'react';
import { StoreCard } from './StoreCard';
import { Store } from '@/types/store';

export const StoreLocations: React.FC = () => {
  const stores: Store[] = [
    {
      name: '成田机场店',
      address: '千葉県成田市吉岡1124-76',
      time: '8:00-20:00',
      tel: '070-6662-0288',
      google_map: 'https://maps.app.goo.gl/CBuo2fbqyuVSCzZt9',
      image: 'https://ai-public.mastergo.com/ai/img_res/cdf485d92b8e70859685cbb1dc683192.jpg'
    },
    {
      name: '上池袋店',
      address: '東京都豊島区上池袋4丁目3−5恩田ビル1F',
      time: '8:00-20:00',
      tel: '080-4612-0188',
      google_map: 'https://maps.app.goo.gl/cGcucAa1HWXnR9GF8',
      image: 'https://ai-public.mastergo.com/ai/img_res/3152122a6fdd97d2f37d6054f81a3e61.jpg'
    },
    {
      name: '八潮南店(本店)',
      address: '埼玉県八潮市大字大曽根705-1',
      time: '10:00-19:00',
      tel: '048-951-1089',
      google_map: 'https://maps.app.goo.gl/J4uZen55aFBZBsyy5',
      image: 'https://ai-public.mastergo.com/ai/img_res/0ac5ab1537398847b6ba818693d78968.jpg'
    }
  ];

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
          {stores.map((store, index) => (
            <StoreCard key={index} {...store} />
          ))}
        </div>
      </div>
    </div>
  );
}; 