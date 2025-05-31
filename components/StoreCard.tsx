'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Clock, Navigation, Phone } from "lucide-react";
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
    <Card className="overflow-hidden flex-shrink-0 w-[280px] md:w-auto mx-2 first:ml-0 last:mr-0 md:mx-0">
      <div className="relative h-36 md:h-40">
        <img
          src={image || '/placeholder-store.jpg'}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-store.jpg';
          }}
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-4">{name}</h3>
        {description && (
          <p className="text-gray-600 text-sm mb-4">{description}</p>
        )}
        <div className="space-y-2 text-gray-600">
          <p className="flex items-start">
            <MapPin className="w-4 h-4 mt-1 mr-3" />
            <span>{address}</span>
          </p>
          <p className="flex items-center">
            <Clock className="w-4 h-4 mr-3" />
            <span>{formatOpeningHours(openingHours)}</span>
          </p>
          <p className="flex items-start">
            <Phone className="w-4 h-4 mt-1 mr-3" />
            <span>{phone}</span>
          </p>
        </div>
        <div className="flex flex-col gap-3 mt-6">
          <Button
            variant="outline"
            className="w-full !rounded-button whitespace-nowrap bg-white border-gray-300 hover:bg-gray-50"
            onClick={() => window.location.href = `tel:${formatTelForCall(phone)}`}
          >
            <Phone className="w-4 h-4 mr-2" />
            拨打电话
          </Button>
          <Button
            className="w-full !rounded-button whitespace-nowrap bg-black text-white hover:bg-gray-800"
            onClick={() => window.open(generateNavigationUrl(), '_blank')}
          >
            <Navigation className="w-4 h-4 mr-2" />
            导航前往
          </Button>
        </div>
      </div>
    </Card>
  );
}; 