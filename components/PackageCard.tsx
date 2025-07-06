'use client'

import React from 'react'
import Image from 'next/image'
import { PackageCardData } from '@/lib/actions/packages'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { ShoppingCart, Eye, Heart, Star } from 'lucide-react'

interface PackageCardProps extends PackageCardData {
  onBuyClick: (packageId: string) => void
  onViewClick: (packageId: string) => void
}

export function PackageCard({
  id,
  name,
  title,
  price,
  originalPrice,
  description,
  thumbnail,
  images,
  stock,
  category,
  tags,
  onBuyClick,
  onViewClick
}: PackageCardProps) {
  const displayImage = thumbnail || images[0] || '/placeholder-package.jpg'
  const hasDiscount = originalPrice && originalPrice > price
  const discountRate = hasDiscount ? Math.round((1 - price / originalPrice) * 100) : 0
  const isOutOfStock = stock <= 0

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      {/* 图片区域 */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={displayImage}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* 库存状态 */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-lg font-semibold">
              暂时缺货
            </span>
          </div>
        )}

        {/* 折扣标签 */}
        {hasDiscount && !isOutOfStock && (
          <div className="absolute top-3 left-3">
            <Badge variant="destructive" className="bg-red-500">
              {discountRate}% OFF
            </Badge>
          </div>
        )}

        {/* 分类标签 */}
        {category && (
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-blue-500 text-white">
              {category}
            </Badge>
          </div>
        )}

        {/* 快速操作按钮 */}
        <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/90 hover:bg-white"
            onClick={() => onViewClick(id)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/90 hover:bg-white"
            onClick={() => {}}
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 卡片内容 */}
      <CardContent className="p-4 flex-1">
        <div className="mb-3">
          <h3 className="font-semibold text-lg leading-tight mb-1 line-clamp-2">
            {title || name}
          </h3>
          {title && (
            <p className="text-sm text-gray-500 line-clamp-1">{name}</p>
          )}
        </div>

        {/* 价格信息 */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl font-bold text-blue-600">
            ¥{price.toLocaleString()}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-sm text-gray-500 line-through">
              ¥{originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* 描述 */}
        {description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {description}
          </p>
        )}

        {/* 标签 */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* 库存信息 */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>库存: {stock}件</span>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>4.8</span>
          </div>
        </div>
      </CardContent>

      {/* 卡片底部 */}
      <CardFooter className="p-4 pt-0">
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onViewClick(id)}
          >
            <Eye className="w-4 h-4 mr-2" />
            查看详情
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={() => onBuyClick(id)}
            disabled={isOutOfStock}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isOutOfStock ? '缺货' : '立即购买'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}