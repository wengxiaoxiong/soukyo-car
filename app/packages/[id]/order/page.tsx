'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { getPackageById } from '@/lib/actions/packages'
import { createOrder } from '@/lib/actions/orders'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, ShoppingCart, Package as PackageIcon, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

export default function PackageOrderPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [package_, setPackage] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    quantity: 1,
    deliveryName: '',
    deliveryPhone: '',
    deliveryAddress: '',
    deliveryNotes: '',
    notes: ''
  })

  const packageId = params.id as string

  useEffect(() => {
    if (status === 'unauthenticated') {
      toast.error('请先登录')
      router.push('/auth/signin')
      return
    }

    const fetchPackage = async () => {
      try {
        const result = await getPackageById(packageId)
        setPackage(result)
      } catch (error) {
        console.error('获取套餐详情失败:', error)
        toast.error('获取套餐详情失败')
        router.push('/packages')
      } finally {
        setLoading(false)
      }
    }

    if (packageId && status === 'authenticated') {
      fetchPackage()
    }
  }, [packageId, status, router])

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.deliveryName || !formData.deliveryPhone || !formData.deliveryAddress) {
      toast.error('请填写完整的收货信息')
      return
    }

    if (formData.quantity <= 0 || formData.quantity > package_.stock) {
      toast.error('请选择有效的购买数量')
      return
    }

    setSubmitting(true)
    try {
      const orderFormData = new FormData()
      orderFormData.append('packageId', packageId)
      orderFormData.append('quantity', formData.quantity.toString())
      orderFormData.append('deliveryName', formData.deliveryName)
      orderFormData.append('deliveryPhone', formData.deliveryPhone)
      orderFormData.append('deliveryAddress', formData.deliveryAddress)
      orderFormData.append('deliveryNotes', formData.deliveryNotes)
      orderFormData.append('notes', formData.notes)

      const result = await createOrder(orderFormData)
      if (result.success) {
        toast.success('订单创建成功！')
        router.push('/orders')
      } else {
        toast.error(result.error || '创建订单失败')
      }
    } catch (error) {
      console.error('创建订单失败:', error)
      toast.error('创建订单失败')
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">正在加载...</p>
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

  const subtotal = package_.price * formData.quantity
  const taxAmount = subtotal * 0.1
  const totalAmount = subtotal + taxAmount
  const isOutOfStock = package_.stock <= 0
  const hasDiscount = package_.originalPrice && package_.originalPrice > package_.price

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">确认订单</h1>
          <p className="text-gray-600">请填写收货信息并确认订单详情</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧订单表单 */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>收货信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      收货人姓名 *
                    </label>
                    <Input
                      type="text"
                      value={formData.deliveryName}
                      onChange={(e) => handleInputChange('deliveryName', e.target.value)}
                      placeholder="请输入收货人姓名"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      联系电话 *
                    </label>
                    <Input
                      type="tel"
                      value={formData.deliveryPhone}
                      onChange={(e) => handleInputChange('deliveryPhone', e.target.value)}
                      placeholder="请输入联系电话"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    收货地址 *
                  </label>
                  <Input
                    type="text"
                    value={formData.deliveryAddress}
                    onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                    placeholder="请输入详细的收货地址"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    收货备注
                  </label>
                  <Textarea
                    value={formData.deliveryNotes}
                    onChange={(e) => handleInputChange('deliveryNotes', e.target.value)}
                    placeholder="如有特殊收货要求，请在此说明"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>购买数量</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">数量：</label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleInputChange('quantity', Math.max(1, formData.quantity - 1))}
                      disabled={formData.quantity <= 1}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                      className="w-20 text-center"
                      min="1"
                      max={package_.stock}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleInputChange('quantity', Math.min(package_.stock, formData.quantity + 1))}
                      disabled={formData.quantity >= package_.stock}
                    >
                      +
                    </Button>
                  </div>
                  <span className="text-sm text-gray-500">
                    (库存: {package_.stock} 件)
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>订单备注</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="如有其他要求或备注，请在此说明"
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>

          {/* 右侧订单摘要 */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>订单摘要</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 套餐信息 */}
                <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                  <Image
                    src={package_.thumbnail || package_.images[0] || '/placeholder-package.jpg'}
                    alt={package_.name}
                    width={60}
                    height={60}
                    className="w-15 h-15 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 line-clamp-2">
                      {package_.title || package_.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      {package_.category && (
                        <Badge variant="outline" className="text-xs">
                          {package_.category}
                        </Badge>
                      )}
                      {hasDiscount && (
                        <Badge variant="destructive" className="text-xs">
                          折扣
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* 价格明细 */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>单价</span>
                    <span>¥{package_.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>数量</span>
                    <span>{formData.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>小计</span>
                    <span>¥{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>税费 (10%)</span>
                    <span>¥{taxAmount.toLocaleString()}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>总计</span>
                    <span className="text-blue-600">¥{totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* 提交按钮 */}
                <Button
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={submitting || isOutOfStock}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      创建中...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {isOutOfStock ? '暂时缺货' : '确认订单'}
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  点击确认订单即表示您同意我们的服务条款
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}