"use client"

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { MapPin, Calendar, Users, Car, ArrowRight, Clock } from "lucide-react";
import { getActiveStores, StoreWithOpeningHours } from '@/app/actions/stores';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { OpeningHours } from '@/lib/utils/store';

interface SearchParams {
  startDate: string;
  endDate: string;
  passengers: string;
}



export const SearchResults: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchData, setSearchData] = useState<SearchParams>({
    startDate: '',
    endDate: '',
    passengers: '4'
  });
  const [stores, setStores] = useState<StoreWithOpeningHours[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 获取搜索参数
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';
    const passengers = searchParams.get('passengers') || '4';

    setSearchData({ startDate, endDate, passengers });

    // 获取店面数据
    const fetchStores = async () => {
      try {
        const storesData = await getActiveStores();
        setStores(storesData);
        setIsLoading(false);
      } catch (error) {
        console.error('获取店面数据失败:', error);
        setIsLoading(false);
      }
    };

    fetchStores();
  }, [searchParams]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateDays = () => {
    if (!searchData.startDate || !searchData.endDate) return 0;
    const start = new Date(searchData.startDate);
    const end = new Date(searchData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const days = calculateDays();

  const handleSearchVehicles = () => {
    if (!selectedStoreId) {
      alert('请选择取车店面');
      return;
    }

    // 构建查询参数
    const queryParams = new URLSearchParams({
      startDate: searchData.startDate,
      endDate: searchData.endDate,
      passengers: searchData.passengers,
      storeId: selectedStoreId
    });

    // 跳转到vehicle页面
    router.push(`/vehicle?${queryParams.toString()}`);
  };

  const getOpeningHoursText = (openingHours: OpeningHours | null) => {
    if (!openingHours || typeof openingHours !== 'object') {
      return '营业时间详询';
    }
    
    // 假设所有工作日时间相同，取 monday 作为代表
    const mondayHours = openingHours.monday;
    if (mondayHours) {
      return `营业时间: ${mondayHours}`;
    }
    
    return '营业时间详询';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-12">
            <Car className="w-12 h-12 mx-auto mb-4 animate-bounce text-blue-600" />
            <h2 className="text-xl font-semibold mb-2">正在加载店面信息...</h2>
            <p className="text-gray-600">请稍等片刻</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* 搜索信息 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {formatDate(searchData.startDate)} - {formatDate(searchData.endDate)}
                  {days > 0 && <span className="ml-1">({days}天)</span>}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{searchData.passengers}人</span>
              </div>
            </div>
          </div>
        </div>

        {/* 店面选择 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">选择取车店面</h2>
          
          {/* 店面选择下拉框 */}
          <div className="mb-6">
            <Label htmlFor="store-select" className="text-base font-medium mb-3 block">
              请选择您的取车店面
            </Label>
            <Select value={selectedStoreId} onValueChange={setSelectedStoreId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="请选择店面..." />
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

          {/* 选中店面的详细信息 */}
          {selectedStoreId && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {stores
                .filter(store => store.id === selectedStoreId)
                .map((store) => (
                  <Card key={store.id} className="overflow-hidden">
                    {store.image && (
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={store.image} 
                          alt={store.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg">{store.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>{store.address}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{getOpeningHoursText(store.openingHours)}</span>
                        </div>

                        {store.description && (
                          <p className="text-sm text-gray-600">{store.description}</p>
                        )}

                        {store.googleMap && (
                          <a 
                            href={store.googleMap}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                          >
                            <MapPin className="w-4 h-4" />
                            查看地图位置
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}

          {/* 继续搜索按钮 */}
          <div className="text-center">
            <Button 
              onClick={handleSearchVehicles}
              disabled={!selectedStoreId}
              size="lg"
              className="px-8"
            >
              查看可用车辆
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {stores.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Car className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">暂无可用店面</h3>
            <p className="text-gray-600 mb-4">请稍后再试或联系客服</p>
            <Button variant="outline" onClick={() => window.history.back()}>
              返回搜索
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}; 