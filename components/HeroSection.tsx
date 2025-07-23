"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Users, Search, MapPin, Sparkles, Car } from "lucide-react";
import { useRouter } from 'next/navigation';
import { getActiveStores, StoreWithOpeningHours } from '@/app/actions/stores';
import { useTranslations } from 'next-intl';

interface SearchFormData {
  startDate: string;
  endDate: string;
  passengers: number;
  storeId: string;
}

export const HeroSection: React.FC = () => {
  const router = useRouter();
  const t = useTranslations('HeroSection');
  const [searchData, setSearchData] = useState<SearchFormData>({
    startDate: '',
    endDate: '',
    passengers: 4,
    storeId: ''
  });
  const [stores, setStores] = useState<StoreWithOpeningHours[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [storesLoading, setStoresLoading] = useState(true);

  // 获取店面数据
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const storesData = await getActiveStores();
        setStores(storesData);
      } catch (error) {
        console.error('获取店面数据失败:', error);
      } finally {
        setStoresLoading(false);
      }
    };

    fetchStores();
  }, []);

  // 处理输入变化
  const handleInputChange = (field: keyof SearchFormData, value: string | number) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 处理搜索
  const handleSearch = async () => {
    if (!searchData.startDate || !searchData.endDate || !searchData.storeId) {
      alert(t('alert.fill_all_fields'));
      return;
    }

    setIsLoading(true);
    try {
      // 构建搜索参数，直接跳转到package页面
      const searchParams = new URLSearchParams({
        startDate: searchData.startDate,
        endDate: searchData.endDate,
        passengers: searchData.passengers.toString(),
        storeId: searchData.storeId
      });

      // 直接跳转到package页面
      router.push(`/package?${searchParams.toString()}`);
    } catch (error) {
      console.error('搜索失败:', error);
      alert(t('alert.search_failed'));
    } finally {
      setIsLoading(false);
    }
  };

  // 获取今天和明天的日期
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* 背景图片和渐变遮罩 */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://ai-public.mastergo.com/ai/img_res/ab15db9d2c399255794e1b782e0095a4.jpg')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-800/75 to-slate-900/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      {/* 装饰性元素 - 在移动端隐藏部分 */}
      <div className="absolute top-20 right-10 opacity-30 animate-pulse hidden sm:block">
        <Sparkles className="w-8 h-8 text-blue-400" />
      </div>
      <div className="absolute top-40 right-32 opacity-20 animate-pulse delay-500 hidden lg:block">
        <Car className="w-6 h-6 text-white" />
      </div>
      <div className="absolute bottom-32 left-10 opacity-20 animate-pulse delay-1000 hidden sm:block">
        <Sparkles className="w-6 h-6 text-blue-300" />
      </div>

      {/* 主内容 */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <div className="w-full grid lg:grid-cols-2 gap-8 lg:gap-12 items-center py-8 lg:py-0">
          
          {/* 左侧：标题和描述 */}
          <div className="text-center lg:text-left order-1 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 backdrop-blur-sm rounded-full text-blue-200 text-xs sm:text-sm font-medium mb-4 sm:mb-6 border border-blue-400/30">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{t('top_banner.text')}</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              {t('title.part1')}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400"> {t('title.japan')}</span>
              <br />
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white/90">{t('title.part2')}</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-white/80 mb-6 sm:mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0 px-2 sm:px-0">
              {t('description')}
            </p>

            {/* 特色标签 - 移动端优化 */}
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start mb-6 sm:mb-8 px-2 sm:px-0">
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-white/90 text-xs sm:text-sm">
                <Car className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{t('features.car_models')}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-white/90 text-xs sm:text-sm">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{t('features.airport_pickup')}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-white/90 text-xs sm:text-sm">
                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{t('features.flexible_booking')}</span>
              </div>
            </div>
          </div>

          {/* 右侧：搜索表单 - 移动端优化 */}
          <div className="w-full max-w-sm sm:max-w-md mx-auto lg:max-w-none order-2 lg:order-2">
            <div className="bg-white/95 backdrop-blur-xl p-4 sm:p-6 rounded-2xl shadow-2xl border border-white/20 mx-2 sm:mx-0">
              <div className="mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 flex items-center gap-2">
                  <Search className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  {t('search_form.title')}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">{t('search_form.subtitle')}</p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {/* 店面选择 */}
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="block text-sm font-medium text-gray-700">{t('search_form.pickup_store')}</label>
                  <Select 
                    value={searchData.storeId} 
                    onValueChange={(value) => handleInputChange('storeId', value)}
                    disabled={storesLoading}
                  >
                    <SelectTrigger className="h-11 sm:h-12 bg-gray-50 border-gray-200 hover:border-blue-400 transition-colors rounded-xl text-sm sm:text-base">
                      <SelectValue placeholder={storesLoading ? t('search_form.loading') : t('search_form.select_pickup_store')} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {stores.map((store) => (
                        <SelectItem key={store.id} value={store.id} className="py-2 text-sm sm:text-base">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                            <span>{store.name} - {store.city}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* 日期选择 - 移动端垂直排列 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="block text-sm font-medium text-gray-700">{t('search_form.pickup_date')}</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                      <Input
                        className="pl-10 h-11 sm:h-12 bg-gray-50 border-gray-200 hover:border-blue-400 transition-colors rounded-xl text-sm sm:text-base"
                        type="date"
                        value={searchData.startDate}
                        min={today}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="block text-sm font-medium text-gray-700">{t('search_form.return_date')}</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                      <Input
                        className="pl-10 h-11 sm:h-12 bg-gray-50 border-gray-200 hover:border-blue-400 transition-colors rounded-xl text-sm sm:text-base"
                        type="date"
                        value={searchData.endDate}
                        min={searchData.startDate || tomorrow}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                {/* 乘客数 */}
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="block text-sm font-medium text-gray-700">{t('search_form.passengers')}</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                    <Input
                      className="pl-10 h-11 sm:h-12 bg-gray-50 border-gray-200 hover:border-blue-400 transition-colors rounded-xl text-sm sm:text-base"
                      type="number"
                      placeholder={t('search_form.enter_passengers_placeholder')}
                      value={searchData.passengers}
                      min="1"
                      max="9"
                      onChange={(e) => handleInputChange('passengers', parseInt(e.target.value) || 1)}
                    />
                  </div>
                </div>

                {/* 搜索按钮 */}
                <Button 
                  className="w-full h-11 sm:h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 text-sm sm:text-base mt-4 sm:mt-6" 
                  onClick={handleSearch}
                  disabled={isLoading || storesLoading}
                >
                  {isLoading ? (
                    <>
                      <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                      {t('search_button.searching')}
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      {t('search_button.find_package')}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 