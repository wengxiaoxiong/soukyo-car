"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Sparkles, Package, ShoppingBag, Star, Users } from "lucide-react";
import { useRouter } from 'next/navigation';

interface SearchFormData {
  category: string;
  priceRange: string;
  searchQuery: string;
}

export const HeroSection: React.FC = () => {
  const router = useRouter();
  const [searchData, setSearchData] = useState<SearchFormData>({
    category: '',
    priceRange: '',
    searchQuery: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // 处理输入变化
  const handleInputChange = (field: keyof SearchFormData, value: string) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 处理搜索
  const handleSearch = async () => {
    setIsLoading(true);
    try {
      // 构建搜索参数，跳转到packages页面
      const searchParams = new URLSearchParams();
      
      if (searchData.category) {
        searchParams.append('category', searchData.category);
      }
      if (searchData.priceRange) {
        const [min, max] = searchData.priceRange.split('-');
        if (min) searchParams.append('minPrice', min);
        if (max) searchParams.append('maxPrice', max);
      }
      if (searchData.searchQuery) {
        searchParams.append('search', searchData.searchQuery);
      }

      // 跳转到packages页面
      router.push(`/packages?${searchParams.toString()}`);
    } catch (error) {
      console.error('搜索失败:', error);
      alert('搜索失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

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
        <Package className="w-6 h-6 text-white" />
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
              <span>精选优质服务套餐</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              发现
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400"> 精彩</span>
              <br />
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white/90">生活服务</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-white/80 mb-6 sm:mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0 px-2 sm:px-0">
              精心策划的优质套餐，让您的生活更加便捷精彩
            </p>

            {/* 特色标签 - 移动端优化 */}
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start mb-6 sm:mb-8 px-2 sm:px-0">
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-white/90 text-xs sm:text-sm">
                <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>多种套餐</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-white/90 text-xs sm:text-sm">
                <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>即买即用</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-white/90 text-xs sm:text-sm">
                <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>品质保证</span>
              </div>
            </div>
          </div>

          {/* 右侧：搜索表单 - 移动端优化 */}
          <div className="w-full max-w-sm sm:max-w-md mx-auto lg:max-w-none order-2 lg:order-2">
            <div className="bg-white/95 backdrop-blur-xl p-4 sm:p-6 rounded-2xl shadow-2xl border border-white/20 mx-2 sm:mx-0">
              <div className="mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 flex items-center gap-2">
                  <Search className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  寻找套餐
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">选择您的需求，立即查找合适套餐</p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {/* 搜索关键词 */}
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="block text-sm font-medium text-gray-700">搜索套餐</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                    <Input
                      className="pl-10 h-11 sm:h-12 bg-gray-50 border-gray-200 hover:border-blue-400 transition-colors rounded-xl text-sm sm:text-base"
                      type="text"
                      placeholder="搜索套餐名称或描述..."
                      value={searchData.searchQuery}
                      onChange={(e) => handleInputChange('searchQuery', e.target.value)}
                    />
                  </div>
                </div>

                {/* 套餐分类 */}
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="block text-sm font-medium text-gray-700">套餐分类</label>
                  <Select 
                    value={searchData.category} 
                    onValueChange={(value) => handleInputChange('category', value)}
                  >
                    <SelectTrigger className="h-11 sm:h-12 bg-gray-50 border-gray-200 hover:border-blue-400 transition-colors rounded-xl text-sm sm:text-base">
                      <SelectValue placeholder="选择套餐分类" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="" className="py-2 text-sm sm:text-base">
                        <div className="flex items-center gap-2">
                          <Package className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                          <span>全部分类</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="美食" className="py-2 text-sm sm:text-base">
                        <div className="flex items-center gap-2">
                          <span>🍽️</span>
                          <span>美食套餐</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="旅游" className="py-2 text-sm sm:text-base">
                        <div className="flex items-center gap-2">
                          <span>🏛️</span>
                          <span>旅游套餐</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="生活" className="py-2 text-sm sm:text-base">
                        <div className="flex items-center gap-2">
                          <span>🏠</span>
                          <span>生活服务</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="娱乐" className="py-2 text-sm sm:text-base">
                        <div className="flex items-center gap-2">
                          <span>🎮</span>
                          <span>娱乐套餐</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* 价格范围 */}
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="block text-sm font-medium text-gray-700">价格范围</label>
                  <Select 
                    value={searchData.priceRange} 
                    onValueChange={(value) => handleInputChange('priceRange', value)}
                  >
                    <SelectTrigger className="h-11 sm:h-12 bg-gray-50 border-gray-200 hover:border-blue-400 transition-colors rounded-xl text-sm sm:text-base">
                      <SelectValue placeholder="选择价格范围" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="" className="py-2 text-sm sm:text-base">全部价格</SelectItem>
                      <SelectItem value="0-100" className="py-2 text-sm sm:text-base">¥100以下</SelectItem>
                      <SelectItem value="100-300" className="py-2 text-sm sm:text-base">¥100 - ¥300</SelectItem>
                      <SelectItem value="300-500" className="py-2 text-sm sm:text-base">¥300 - ¥500</SelectItem>
                      <SelectItem value="500-1000" className="py-2 text-sm sm:text-base">¥500 - ¥1000</SelectItem>
                      <SelectItem value="1000-" className="py-2 text-sm sm:text-base">¥1000以上</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 搜索按钮 */}
                <Button 
                  className="w-full h-11 sm:h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 text-sm sm:text-base mt-4 sm:mt-6" 
                  onClick={handleSearch}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                      搜索中...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      立即查找套餐
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