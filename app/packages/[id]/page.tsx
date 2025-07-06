'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getPackageById } from '@/lib/actions/packages'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, ShoppingCart, Heart, Share2, Star, Package as PackageIcon } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

export default function PackageDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [package_, setPackage] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const packageId = params.id as string

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const result = await getPackageById(packageId)
        setPackage(result)
      } catch (error) {
        console.error('获取套餐详情失败:', error)
        toast.error('获取套餐详情失败')
      } finally {
        setLoading(false)
      }
    }

    if (packageId) {
      fetchPackage()
    }
  }, [packageId])

  const handleBuyClick = () => {
    router.push(`/packages/${packageId}/order`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">正在加载套餐详情...</p>
        </div>
      </div>
    )
  }

  if (!package_) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <PackageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">套餐不存在</h1>
          <p className="text-gray-600 mb-4">您访问的套餐不存在或已下架</p>
          <Button onClick={() => router.push('/packages')}>
            返回套餐列表
          </Button>
        </div>
      </div>
    )
  }

  const hasDiscount = package_.originalPrice && package_.originalPrice > package_.price
  const discountRate = hasDiscount ? Math.round((1 - package_.price / package_.originalPrice) * 100) : 0
  const isOutOfStock = package_.stock <= 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧图片区域 */}
          <div className="space-y-4">
            {/* 主图片 */}
            <div className="aspect-square overflow-hidden rounded-2xl bg-white shadow-lg">
              <Image
                src={package_.images[selectedImageIndex] || '/placeholder-package.jpg'}
                alt={package_.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>

            {/* 缩略图 */}
            {package_.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {package_.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${package_.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 右侧信息区域 */}
          <div className="space-y-6">
            {/* 套餐基本信息 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                {package_.category && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {package_.category}
                  </Badge>
                )}
                {hasDiscount && (
                  <Badge variant="destructive" className="bg-red-500">
                    {discountRate}% OFF
                  </Badge>
                )}
                {isOutOfStock && (
                  <Badge variant="destructive">
                    暂时缺货
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {package_.title || package_.name}
              </h1>
              
              {package_.title && (
                <p className="text-lg text-gray-600 mb-4">{package_.name}</p>
              )}

              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <Star className="w-5 h-5 fill-gray-200 text-gray-200" />
                </div>
                <span className="text-sm text-gray-600">(4.0 分)</span>
              </div>

              {package_.description && (
                <p className="text-gray-600 text-lg leading-relaxed">
                  {package_.description}
                </p>
              )}
            </div>

            {/* 价格和库存 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-3xl font-bold text-blue-600">
                      ¥{package_.price.toLocaleString()}
                    </div>
                    {hasDiscount && (
                      <div className="text-lg text-gray-500 line-through">
                        ¥{package_.originalPrice.toLocaleString()}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">库存</div>
                    <div className={`text-lg font-semibold ${
                      package_.stock <= 0 ? 'text-red-600' : 
                      package_.stock <= 10 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {package_.stock} 件
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    onClick={handleBuyClick}
                    disabled={isOutOfStock}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {isOutOfStock ? '暂时缺货' : '立即购买'}
                  </Button>
                  <Button variant="outline" size="lg">
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="lg">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 标签 */}
            {package_.tags && package_.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">标签</h3>
                <div className="flex flex-wrap gap-2">
                  {package_.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 详细描述 */}
        {package_.content && (
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle>套餐详情</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: package_.content }}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}