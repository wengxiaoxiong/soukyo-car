'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Package, Star, ShoppingCart, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { PackageWithStore } from '@/lib/actions/packages'

interface PackageCardProps extends PackageWithStore {
  showPurchaseButton?: boolean
}

export const PackageCard: React.FC<PackageCardProps> = ({
  id,
  name,
  description,
  images,
  price,
  stock,
  store,
  showPurchaseButton = true
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handlePurchase = async () => {
    setIsLoading(true)
    // 这里可以添加购买逻辑
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <Card className="overflow-hidden flex-shrink-0 w-[300px] md:w-auto mx-2 first:ml-0 last:mr-0 md:mx-0 hover:shadow-lg transition-all duration-300 group">
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* 图片轮播 */}
        {images.length > 0 ? (
          <div className="relative w-full h-full">
            <Image
              src={images[currentImageIndex]}
              alt={name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* 图片导航 */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                
                {/* 图片指示器 */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Package className="w-16 h-16 text-gray-400" />
          </div>
        )}
        
        {/* 库存状态 */}
        <div className="absolute top-3 right-3">
          <Badge 
            variant={stock > 0 ? "default" : "destructive"}
            className="bg-white/90 text-gray-900 hover:bg-white"
          >
            库存: {stock}
          </Badge>
        </div>
      </div>
      
      <div className="p-6">
        {/* 套餐标题 */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2">{name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{store.name} - {store.city}</span>
          </div>
        </div>
        
        {/* 套餐描述 */}
        {description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{description}</p>
        )}
        
        {/* 价格 */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-600">¥{price.toLocaleString()}</span>
            <span className="text-sm text-gray-500">/ 套餐</span>
          </div>
        </div>
        
        {/* 操作按钮 */}
        <div className="flex gap-2">
          <Link href={`/package/${id}`} className="flex-1">
            <Button 
              variant="outline" 
              className="w-full flex items-center gap-2 hover:bg-gray-50"
            >
              <Eye className="w-4 h-4" />
              查看详情
            </Button>
          </Link>
          
          {showPurchaseButton && (
            <Button 
              onClick={handlePurchase}
              disabled={stock <= 0 || isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              {isLoading ? '处理中...' : stock <= 0 ? '已售罄' : '立即购买'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}