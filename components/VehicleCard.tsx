import React from 'react'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Users, Calendar } from "lucide-react"
import type { VehicleListItem } from '@/lib/actions/cars'

export const VehicleCard: React.FC<VehicleListItem> = ({
  id,
  name,
  brand,
  model,
  year,
  seats,
  pricePerDay,
  image,
  color,
  isAvailable,
  store
}) => {
  const handleRentClick = () => {
    // TODO: 跳转到租车预订页面
    console.log('租车:', id)
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* 车辆图片 */}
      <div className="relative">
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover"
        />
        {!isAvailable && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Badge variant="secondary" className="text-white bg-red-600">
              暂不可租
            </Badge>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-blue-600 text-white">
            {brand}
          </Badge>
        </div>
      </div>

      {/* 车辆信息 */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {name}
            </h3>
            <p className="text-sm text-gray-600">
              {model} {year}年
              {color && ` · ${color}`}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              ¥{pricePerDay}
            </div>
            <div className="text-sm text-gray-500">
              /天
            </div>
          </div>
        </div>

        {/* 车辆特性 */}
        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{seats}座</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{year}年</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>{store.city}</span>
          </div>
        </div>

        {/* 店面信息 */}
        <div className="text-sm text-gray-600 mb-4">
          <span className="font-medium">取还车地点：</span>
          {store.name} ({store.city})
        </div>

        {/* 操作按钮 */}
        <Button
          onClick={handleRentClick}
          disabled={!isAvailable}
          className="w-full"
        >
          {isAvailable ? '立即租车' : '暂不可租'}
        </Button>
      </div>
    </Card>
  )
} 