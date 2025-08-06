'use client'

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, ArrowRight } from "lucide-react";
import type { CarCardData } from '@/lib/actions/cars';
import Image from 'next/image';

interface CarCardProps extends Omit<CarCardData, 'originalData'> {
  // 可以选择性地添加点击回调等额外功能
  onBookClick?: (carId: string) => void;
}

// 工具函数：从CarCardData创建CarCard属性
export const createCarCardProps = (carData: CarCardData, onBookClick?: (carId: string) => void): CarCardProps => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { originalData, ...cardProps } = carData;
  return {
    ...cardProps,
    onBookClick
  };
};

export const CarCard: React.FC<CarCardProps> = ({
  id,
  name,
  type,
  price,
  image,
  location,
  seats,
  onBookClick
}) => {
  const handleBookClick = () => {
    if (onBookClick) {
      onBookClick(id);
    } else {
      // 默认行为，比如跳转到预订页面
      window.location.href = `/booking/${id}`;
    }
  };

  return (
    <Card className="overflow-hidden flex-shrink-0 w-[300px] md:w-auto mx-2 first:ml-0 last:mr-0 md:mx-0 bg-white hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group border-0 shadow-lg">
      <div className="relative h-52 md:h-60 overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-4 right-4">
          <Badge className="bg-white/95 text-gray-800 hover:bg-white font-medium shadow-sm">
            {type}
          </Badge>
        </div>
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
            <ArrowRight className="w-5 h-5 text-gray-700" />
          </div>
        </div>
      </div>
      
      <div className="p-6 flex flex-col h-[calc(100%-13rem)] md:h-[calc(100%-15rem)]">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors duration-200 truncate">{name}</h3>
            <div className="flex items-center text-gray-500 text-sm mb-3">
              <MapPin className="inline w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
            <Users className="w-4 h-4 mr-2" />
            {seats}座
          </Badge>
          <div className="text-right">
            <div className="text-sm text-gray-500">租金</div>
            <div className="text-2xl font-bold text-blue-600">{price}<span className="text-sm font-normal text-gray-500">/天</span></div>
          </div>
        </div>

        <Button 
          className="w-full mt-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group/btn"
          onClick={handleBookClick}
        >
          <span>立即预订</span>
          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" />
        </Button>
      </div>
    </Card>
  );
}; 