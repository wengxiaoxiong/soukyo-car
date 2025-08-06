'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Clock, Navigation, Phone, ArrowRight } from "lucide-react";
import { formatOpeningHours, OpeningHours } from "@/lib/utils/store";

interface StoreCardProps {
  id: string
  name: string
  address: string
  phone: string
  image: string | null
  googleMap?: string | null
  openingHours: OpeningHours | null
  description: string | null
  latitude: number | null
  longitude: number | null
  isActive: boolean
}

export const StoreCard: React.FC<StoreCardProps> = ({
  name,
  address,
  phone,
  image,
  googleMap,
  openingHours,
  latitude,
  longitude,
  description
}) => {
  // 处理日本电话号码，添加国际区号
  const formatTelForCall = (phoneNumber: string) => {
    // 移除所有非数字字符
    const digits = phoneNumber.replace(/\D/g, '');
    // 如果是日本号码（以0开头），转换为国际格式
    if (digits.startsWith('0')) {
      return `+81${digits.slice(1)}`;
    }
    return phoneNumber;
  };

  // 生成导航链接，优先使用googleMap
  const generateNavigationUrl = () => {
    if (googleMap) {
      return googleMap;
    }
    if (latitude && longitude) {
      return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    }
    // 如果没有坐标，使用地址搜索
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };

  return (
    <Card className="overflow-hidden flex-shrink-0 w-[300px] md:w-auto mx-2 first:ml-0 last:mr-0 md:mx-0 bg-white hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group border-0 shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
        <Image
          src={image || '/placeholder-store.jpg'}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-store.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
            <ArrowRight className="w-5 h-5 text-gray-700" />
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-blue-600 transition-colors duration-200">{name}</h3>
        {description && (
          <p className="text-gray-600 text-sm mb-6 leading-relaxed line-clamp-2">{description}</p>
        )}
        
        <div className="space-y-4 text-gray-600 mb-8">
          <div className="flex items-start">
            <MapPin className="w-4 h-4 mt-1 mr-3 text-blue-500 flex-shrink-0" />
            <span className="text-sm leading-relaxed">{address}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-3 text-green-500 flex-shrink-0" />
            <span className="text-sm">{formatOpeningHours(openingHours)}</span>
          </div>
          <div className="flex items-start">
            <Phone className="w-4 h-4 mt-1 mr-3 text-purple-500 flex-shrink-0" />
            <span className="text-sm">{phone}</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-3">
          <Button
            variant="outline"
            className="w-full bg-white border-gray-200 hover:bg-gray-50 hover:border-blue-300 text-gray-700 hover:text-blue-600 rounded-xl transition-all duration-200 group/btn"
            onClick={() => window.location.href = `tel:${formatTelForCall(phone)}`}
          >
            <Phone className="w-4 h-4 mr-2" />
            <span>拨打电话</span>
            <ArrowRight className="w-4 h-4 ml-auto group-hover/btn:translate-x-1 transition-transform duration-200" />
          </Button>
          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group/btn"
            onClick={() => window.open(generateNavigationUrl(), '_blank')}
          >
            <Navigation className="w-4 h-4 mr-2" />
            <span>导航前往</span>
            <ArrowRight className="w-4 h-4 ml-auto group-hover/btn:translate-x-1 transition-transform duration-200" />
          </Button>
        </div>
      </div>
    </Card>
  );
}; 