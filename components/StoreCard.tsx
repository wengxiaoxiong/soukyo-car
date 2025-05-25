import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Clock, Navigation, Phone } from "lucide-react";
import { Store } from "@/types/store";

type StoreCardProps = Store;

export const StoreCard: React.FC<StoreCardProps> = ({
  name,
  address,
  time,
  tel,
  google_map,
  image
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
  return (
    <Card className="overflow-hidden flex-shrink-0 w-[280px] md:w-auto mx-2 first:ml-0 last:mr-0 md:mx-0">
      <div className="relative h-36 md:h-40">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-4">{name}</h3>
        <div className="space-y-2 text-gray-600">
          <p className="flex items-start">
            <MapPin className="w-4 h-4 mt-1 mr-3" />
            <span>{address}</span>
          </p>
          <p className="flex items-center">
            <Clock className="w-4 h-4 mr-3" />
            <span>{time}</span>
          </p>
          <p className="flex items-start">
            <Phone className="w-4 h-4 mt-1 mr-3" />
            <span>{tel}</span>
          </p>
        </div>
        <div className="flex flex-col gap-3 mt-6">
          <Button
            variant="outline"
            className="w-full !rounded-button whitespace-nowrap bg-white border-gray-300 hover:bg-gray-50"
            onClick={() => window.location.href = `tel:${formatTelForCall(tel)}`}
          >
            <Phone className="w-4 h-4 mr-2" />
            拨打电话
          </Button>
          <Button
            className="w-full !rounded-button whitespace-nowrap bg-black text-white hover:bg-gray-800"
            onClick={() => window.open(google_map, '_blank')}
          >
            <Navigation className="w-4 h-4 mr-2" />
            导航前往
          </Button>
        </div>
      </div>
    </Card>
  );
}; 