'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useTranslations, useLocale } from 'next-intl'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ShoppingCart, Package, Star, Clock, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { getPackageById, Package as PackageType, createPackageBooking } from '@/lib/actions/packages'
import { toast } from 'sonner'
import { notFound } from 'next/navigation'

interface PackageDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function PackageDetailPage({ params }: PackageDetailPageProps) {
  const [packageData, setPackageData] = useState<PackageType | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isPurchasing, setIsPurchasing] = useState(false)
  
  const router = useRouter()
  const { data: session } = useSession()
  const t = useTranslations()
  const locale = useLocale()

  // 获取套餐详情
  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const resolvedParams = await params
        const pkg = await getPackageById(resolvedParams.id)
        
        if (!pkg) {
          notFound()
          return
        }
        
        setPackageData(pkg)
      } catch (error) {
        console.error('获取套餐详情失败:', error)
        toast.error('获取套餐详情失败')
      } finally {
        setLoading(false)
      }
    }

    fetchPackage()
  }, [params])

  // 图片导航
  const nextImage = () => {
    if (packageData?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % packageData.images.length)
    }
  }

  const prevImage = () => {
    if (packageData?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + packageData.images.length) % packageData.images.length)
    }
  }

  // 购买套餐
  const handlePurchase = async () => {
    if (!session) {
      toast.error('请先登录')
      router.push(`/${locale}/auth/signin`)
      return
    }

    if (!packageData || packageData.stock <= 0) {
      toast.error('库存不足')
      return
    }

    setIsPurchasing(true)
    try {
      const result = await createPackageBooking(packageData.id)
      
      if (result.success && 'checkoutUrl' in result && result.checkoutUrl) {
        // 直接跳转到Stripe Checkout页面
        window.location.href = result.checkoutUrl
      } else {
        toast.error(result.error || '创建订单失败')
      }
    } catch (error) {
      console.error('购买套餐失败:', error)
      toast.error('购买套餐失败')
    } finally {
      setIsPurchasing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (!packageData) {
    return notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 返回按钮 */}
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          {t('common.back')}
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 图片展示区域 */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden">
              {packageData.images && packageData.images.length > 0 ? (
                <>
                  <Image
                    src={packageData.images[currentImageIndex]}
                    alt={packageData.name}
                    fill
                    className="object-cover"
                  />
                  
                  {packageData.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Package className="w-24 h-24 text-gray-400" />
                </div>
              )}
            </div>

            {/* 缩略图 */}
            {packageData.images && packageData.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {packageData.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 ${
                      index === currentImageIndex ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${packageData.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 套餐信息区域 */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {packageData.name}
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                {packageData.description}
              </p>
              
              {/* 价格和库存 */}
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-blue-600">
                  ¥{packageData.price.toLocaleString()}
                </span>
                <Badge variant={packageData.stock > 0 ? 'default' : 'secondary'}>
                  {packageData.stock > 0 ? `库存：${packageData.stock}` : '已售罄'}
                </Badge>
              </div>
            </div>

            {/* 套餐特点 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">精选套餐</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Shield className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">品质保证</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">快速交付</p>
                </CardContent>
              </Card>
            </div>

            {/* 购买按钮 */}
            <div className="space-y-4">
              <Button
                onClick={handlePurchase}
                disabled={packageData.stock <= 0 || isPurchasing}
                className="w-full h-12 text-lg font-semibold"
                size="lg"
              >
                {isPurchasing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    处理中...
                  </div>
                ) : packageData.stock <= 0 ? (
                  '已售罄'
                ) : (
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    立即购买
                  </div>
                )}
              </Button>
              
              {!session && (
                <p className="text-sm text-gray-600 text-center">
                  需要登录才能购买套餐
                </p>
              )}
            </div>

            {/* 套餐详细内容 */}
            {packageData.content && (
              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-4">套餐详情</h3>
                <div 
                  className="prose prose-sm max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: packageData.content }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 