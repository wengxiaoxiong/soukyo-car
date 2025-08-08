'use client'

import React, { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Package, ShoppingCart, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Package as PackageType, createPackageBooking } from '@/lib/actions/packages'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface PackageCardProps extends PackageType {
  showPurchaseButton?: boolean
}

export const PackageCard: React.FC<PackageCardProps> = ({
  id,
  name,
  description,
  images,
  price,
  stock,
  showPurchaseButton = true
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations()
  const locale = useLocale()
  const { data: session } = useSession()
  const router = useRouter()

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handlePurchase = async () => {
    if (!session) {
      toast.error('请先登录')
      router.push(`/${locale}/auth/signin`)
      return
    }

    if (stock <= 0) {
      toast.error('库存不足')
      return
    }

    setIsLoading(true)
    try {
      const result = await createPackageBooking(id)
      
      if (result.success && 'checkoutUrl' in result && result.checkoutUrl) {
        // 直接跳转到Stripe Checkout页面
        window.location.href = result.checkoutUrl
      } else {
        toast.error(result.error || '创建订单失败')
        setIsLoading(false)
      }
    } catch (error) {
      console.error('购买套餐失败:', error)
      toast.error('购买套餐失败')
      setIsLoading(false)
    }
  }

  return (
    <Card className="pt-0 overflow-hidden flex-shrink-0 w-[300px] md:w-auto mx-2 first:ml-0 last:mr-0 md:mx-0 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group transform">
      <div className="relative aspect-[2/1] overflow-hidden">
        {/* 图片轮播 */}
        {images.length > 0 ? (
          <div className="relative w-full h-full">
            <Image
              src={images[currentImageIndex]}
              alt={name}
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-110"
            />
            
            {/* 图片导航 */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-2/3 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-md transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-2/3 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-md transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                
                {/* 图片指示器 */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">


                  {images.map((_: string, index: number) => (
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
            {stock > 0 ? t('common.available') : t('common.unavailable')}: {stock}
          </Badge>
        </div>
      </div>
      
      <div className="p-6">
        {/* 套餐标题（固定两行高度，避免按钮错位） */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2 h-[3.5rem] group-hover:text-blue-600 transition-colors duration-300">{name}</h3>
        </div>
        
        {/* 套餐描述 */}
        <div className="min-h-[3.5rem] mb-4">
          {description && (
            <p className="text-gray-600 text-sm line-clamp-3">{description}</p>
          )}
        </div>
        
        {/* 价格 */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors duration-300">{t('common.currency')}{price.toLocaleString()}</span>
            <span className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300">/ {t('packages.title')}</span>
          </div>
        </div>
        
        {/* 操作按钮 */}
        <div className="flex flex-col gap-2">
          <Link href={`/${locale}/package/${id}`} className="w-full">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 hover:bg-gray-50 text-sm"
            >
              <Eye className="w-4 h-4" />
              <span className="truncate">{t('packages.view_details')}</span>
            </Button>
          </Link>
          
          {showPurchaseButton && (
            <Button 
              onClick={handlePurchase}
              disabled={stock <= 0 || isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 text-sm"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="truncate">
                {isLoading ? t('common.loading') : stock <= 0 ? t('common.unavailable') : t('packages.book_package')}
              </span>
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}