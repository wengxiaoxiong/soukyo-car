'use client'

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users } from "lucide-react";
import type { CarCardData } from '@/lib/actions/cars';

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
    <Card className="overflow-hidden flex-shrink-0 w-[280px] md:w-auto mx-2 first:ml-0 last:mr-0 md:mx-0  pt-0">
      <div className="relative h-48 md:h-56 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4">
          <Badge className="bg-white/80 text-black hover:bg-white/90">
            {type}
          </Badge>
        </div>
      </div>
      <div className="p-6 flex flex-col h-[calc(100%-12rem)] md:h-[calc(100%-14rem)]">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">{name}</h3>
            <p className="text-gray-600 text-sm">
              <MapPin className="inline w-4 h-4 mr-2" />
              {location}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">租金</div>
            <div className="text-xl font-bold text-primary">{price}/天</div>
          </div>
        </div>
        <div className="flex gap-4 mb-6">
          <Badge variant="secondary">
            <Users className="w-4 h-4 mr-2" />
            {seats}
          </Badge>
        </div>
        <Button 
          className="w-full !rounded-button whitespace-nowrap mt-auto"
          onClick={handleBookClick}
        >
          立即预订
        </Button>
      </div>
    </Card>
  );
}; 