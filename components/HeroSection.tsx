"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Users, Search } from "lucide-react";
import { useRouter } from 'next/navigation';
import { getActiveStores, StoreWithOpeningHours } from '@/app/actions/stores';

interface SearchFormData {
  startDate: string;
  endDate: string;
  passengers: number;
  storeId: string;
}

export const HeroSection: React.FC = () => {
  const router = useRouter();
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
      alert('请填写完整的搜索信息并选择取车店面');
      return;
    }

    setIsLoading(true);
    try {
      // 构建搜索参数，直接跳转到vehicle页面
      const searchParams = new URLSearchParams({
        startDate: searchData.startDate,
        endDate: searchData.endDate,
        passengers: searchData.passengers.toString(),
        storeId: searchData.storeId
      });

      // 直接跳转到vehicle页面
      router.push(`/vehicle?${searchParams.toString()}`);
    } catch (error) {
      console.error('搜索失败:', error);
      alert('搜索失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 获取今天和明天的日期
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <div className="relative min-h-[700px] md:min-h-[650px] w-full">
      {/* Hero Background Image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `url('https://ai-public.mastergo.com/ai/img_res/ab15db9d2c399255794e1b782e0095a4.jpg')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
      </div>
      {/* Hero Content */}
      <div className="relative max-w-[1440px] mx-auto px-4 md:px-8 pt-24 md:pt-32 pb-8">
        <div className="max-w-4xl">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6">探索日本，从这里开始</h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 md:mb-12">便捷的租车服务，让您的旅程更自由</p>
          {/* Search Box */}
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl max-w-4xl">
            <div className="space-y-6">
              {/* 店面选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">取车店面</label>
                <Select 
                  value={searchData.storeId} 
                  onValueChange={(value) => handleInputChange('storeId', value)}
                  disabled={storesLoading}
                >
                  <SelectTrigger className="h-12 bg-gray-50 border-gray-200 hover:bg-white transition-colors">
                    <SelectValue placeholder={storesLoading ? "加载中..." : "选择取车店面"} />
                  </SelectTrigger>
                  <SelectContent>
                    {stores.map((store) => (
                      <SelectItem key={store.id} value={store.id}>
                        {store.name} - {store.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* 日期选择 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">取车日期</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      className="pl-12 h-12 bg-gray-50 border-gray-200 hover:bg-white transition-colors"
                      type="date"
                      value={searchData.startDate}
                      min={today}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">还车日期</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      className="pl-12 h-12 bg-gray-50 border-gray-200 hover:bg-white transition-colors"
                      type="date"
                      value={searchData.endDate}
                      min={searchData.startDate || tomorrow}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              {/* 乘客数和搜索按钮 */}
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="w-full sm:w-48">
                  <label className="block text-sm font-medium text-gray-700 mb-2">乘客数量</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      className="pl-12 h-12 bg-gray-50 border-gray-200 hover:bg-white transition-colors"
                      type="number"
                      placeholder="请输入人数"
                      value={searchData.passengers}
                      min="1"
                      max="9"
                      onChange={(e) => handleInputChange('passengers', parseInt(e.target.value) || 1)}
                    />
                  </div>
                </div>
                <Button 
                  className="w-full sm:w-auto h-12 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex-shrink-0" 
                  size="lg"
                  onClick={handleSearch}
                  disabled={isLoading || storesLoading}
                >
                  {isLoading ? (
                    <>
                      <Search className="w-5 h-5 mr-2 animate-spin" />
                      搜索中...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      立即查找车辆
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 