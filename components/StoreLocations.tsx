import React from 'react';
import { StoreCard } from './StoreCard';
import { getActiveStores } from '@/app/actions/stores';
  import { MapPin, Building2, Plane } from "lucide-react";

export const revalidate = 3600 // 每小时重新生成一次

export const StoreLocations: React.FC = async () => {
  const stores = await getActiveStores();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
            <Building2 className="w-4 h-4" />
            <span>门店网络</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            东京门店分布
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            覆盖东京两大主要机场，为您提供便捷的取还车服务
          </p>
        </div>

        {/* Stats */}
        {stores.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stores.length}+</div>
              <div className="text-gray-600">服务门店</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">24/7</div>
              <div className="text-gray-600">全天候服务</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plane className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">2</div>
              <div className="text-gray-600">机场</div>
            </div>
          </div>
        )}

        {/* Stores Grid */}
        <div className="relative">
          {/* 移动端滚动提示 */}
          {stores.length > 0 && (
            <div className="md:hidden mb-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm text-sm text-gray-500">
                <span>← 左右滑动查看更多 →</span>
              </div>
            </div>
          )}
          
          {/* 门店卡片容器 */}
          <div className="flex overflow-x-auto pb-6 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 scrollbar-hide">
            {stores.length > 0 ? (
              stores.map((store) => (
                <StoreCard key={store.id} {...store} />
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                  <Building2 className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">暂无可用店面</h3>
                <p className="text-gray-500 text-lg">我们正在扩展更多服务网点</p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        {stores.length > 0 && (
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                机场取车服务
              </h3>
              <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                成田机场、羽田机场取车服务，为您提供便捷的取还车服务。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center gap-2 text-gray-700">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span>在线客服</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span>中文服务支持</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                  <span>机场取车</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}; 