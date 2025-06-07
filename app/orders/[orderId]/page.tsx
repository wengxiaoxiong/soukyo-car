'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getOrderDetails, cancelOrder } from '@/lib/actions/booking'
import { useSession } from 'next-auth/react'
import { 
  Loader2, 
  Calendar, 
  MapPin, 
  Phone, 
  CreditCard, 
  User, 
  Clock,
  Car,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

type OrderDetails = {
  id: string
  orderNumber: string
  status: string
  startDate: Date
  endDate: Date
  totalDays: number
  pricePerDay: number
  subtotal: number
  taxAmount: number
  totalAmount: number
  driverLicense: string
  emergencyContact?: string
  emergencyPhone?: string
  pickupLocation?: string
  dropoffLocation?: string
  pickupTime?: Date
  dropoffTime?: Date
  notes?: string
  createdAt: Date
  vehicle: {
    id: string
    name: string
    brand: string
    model: string
    year: number
    seats: number
    images: string[]
    color?: string
    plateNumber?: string
    store: {
      id: string
      name: string
      address: string
      phone: string
    }
  }
  store: {
    id: string
    name: string
    address: string
    phone: string
  }
  payments: Array<{
    id: string
    amount: number
    status: string
    createdAt: Date
  }>
  user: {
    id: string
    name?: string
    email: string
  }
}

// 获取订单状态的显示信息
const getStatusInfo = (status: string) => {
  switch (status) {
    case 'PENDING':
      return { 
        label: '待确认', 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Clock
      }
    case 'CONFIRMED':
      return { 
        label: '已确认', 
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: CheckCircle
      }
    case 'ONGOING':
      return { 
        label: '进行中', 
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: Car
      }
    case 'COMPLETED':
      return { 
        label: '已完成', 
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: CheckCircle
      }
    case 'CANCELLED':
      return { 
        label: '已取消', 
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircle
      }
    case 'REFUNDED':
      return { 
        label: '已退款', 
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: CreditCard
      }
    default:
      return { 
        label: '未知状态', 
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: AlertCircle
      }
  }
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { status: sessionStatus } = useSession()
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)

  const orderId = params?.orderId as string

  // 获取订单详情
  const fetchOrderDetails = async () => {
    if (!orderId) return

    setLoading(true)
    try {
      const result = await getOrderDetails(orderId)
      if (result.success && result.order) {
        setOrder(result.order as OrderDetails)
      } else {
        toast.error(result.error || '获取订单详情失败')
        router.push('/orders')
      }
    } catch {
      toast.error('获取订单详情失败')
      router.push('/orders')
    }
    setLoading(false)
  }

  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      toast.error('请先登录')
      router.push('/auth/signin')
      return
    }

    if (sessionStatus === 'authenticated') {
      fetchOrderDetails()
    }
  }, [sessionStatus, orderId, router])

  // 取消订单
  const handleCancelOrder = async () => {
    if (!order || !confirm('确定要取消这个订单吗？')) {
      return
    }

    setCancelling(true)
    try {
      const result = await cancelOrder(order.id)
      if (result.success) {
        toast.success('订单已取消')
        fetchOrderDetails() // 重新获取订单详情
      } else {
        toast.error(result.error || '取消订单失败')
      }
    } catch {
      toast.error('取消订单失败')
    }
    setCancelling(false)
  }

  if (sessionStatus === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">正在加载...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">订单不存在</h2>
          <p className="text-gray-600 mb-4">请检查订单链接是否正确</p>
          <Button onClick={() => router.push('/orders')}>
            返回订单列表
          </Button>
        </div>
      </div>
    )
  }

  const statusInfo = getStatusInfo(order.status)
  const StatusIcon = statusInfo.icon

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面标题 */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/orders')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              返回订单列表
            </Button>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">订单详情</h1>
              <p className="text-gray-600">订单号: {order.orderNumber}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge className={`px-3 py-1 flex items-center gap-2 ${statusInfo.color}`}>
                <StatusIcon className="w-4 h-4" />
                {statusInfo.label}
              </Badge>
              
              {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="flex items-center gap-2"
                >
                  {cancelling ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  取消订单
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 主要信息 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 车辆信息 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  车辆信息
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  {/* 车辆图片 */}
                  {order.vehicle.images?.[0] && (
                    <div className="w-full md:w-48 h-32 md:h-36 relative rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={order.vehicle.images[0]}
                        alt={order.vehicle.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* 车辆详情 */}
                  <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {order.vehicle.name}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>品牌: {order.vehicle.brand}</div>
                      <div>型号: {order.vehicle.model}</div>
                      <div>年份: {order.vehicle.year}</div>
                      <div>座位数: {order.vehicle.seats}</div>
                      {order.vehicle.color && (
                        <div>颜色: {order.vehicle.color}</div>
                      )}
                      {order.vehicle.plateNumber && (
                        <div>车牌: {order.vehicle.plateNumber}</div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 租期信息 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  租期信息
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">开始日期</div>
                    <div className="text-gray-900">
                      {format(new Date(order.startDate), 'yyyy年MM月dd日', { locale: zhCN })}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">结束日期</div>
                    <div className="text-gray-900">
                      {format(new Date(order.endDate), 'yyyy年MM月dd日', { locale: zhCN })}
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">租期天数</span>
                  <span className="text-lg font-semibold text-gray-900">{order.totalDays} 天</span>
                </div>
              </CardContent>
            </Card>

            {/* 取车和还车信息 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  门店信息
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">门店名称</div>
                  <div className="text-gray-900">{order.store.name}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">门店地址</div>
                  <div className="text-gray-900">{order.store.address}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">联系电话</div>
                  <div className="text-gray-900 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {order.store.phone}
                  </div>
                </div>
                
                {(order.pickupLocation || order.dropoffLocation) && (
                  <>
                    <Separator />
                    {order.pickupLocation && (
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-1">取车地点</div>
                        <div className="text-gray-900">{order.pickupLocation}</div>
                      </div>
                    )}
                    {order.dropoffLocation && (
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-1">还车地点</div>
                        <div className="text-gray-900">{order.dropoffLocation}</div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* 驾驶员信息 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  驾驶员信息
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">驾驶证号码</div>
                  <div className="text-gray-900">{order.driverLicense}</div>
                </div>
                
                {order.emergencyContact && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">紧急联系人</div>
                    <div className="text-gray-900">{order.emergencyContact}</div>
                  </div>
                )}
                
                {order.emergencyPhone && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">紧急联系电话</div>
                    <div className="text-gray-900 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {order.emergencyPhone}
                    </div>
                  </div>
                )}
                
                {order.notes && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">备注</div>
                    <div className="text-gray-900 p-3 bg-gray-50 rounded-lg">
                      {order.notes}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            {/* 价格信息 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  价格明细
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">单价/天</span>
                  <span className="text-gray-900">¥{order.pricePerDay.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">租期 ({order.totalDays} 天)</span>
                  <span className="text-gray-900">¥{order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">税费</span>
                  <span className="text-gray-900">¥{order.taxAmount.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-gray-900">总计</span>
                  <span className="text-blue-600">¥{order.totalAmount.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* 订单状态时间线 */}
            <Card>
              <CardHeader>
                <CardTitle>订单状态</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div>
                      <div className="text-sm font-medium">订单创建</div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(order.createdAt), 'yyyy-MM-dd HH:mm', { locale: zhCN })}
                      </div>
                    </div>
                  </div>
                  
                  {order.status !== 'PENDING' && (
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        ['CONFIRMED', 'ONGOING', 'COMPLETED'].includes(order.status) 
                          ? 'bg-green-500' 
                          : order.status === 'CANCELLED' 
                          ? 'bg-red-500' 
                          : 'bg-gray-300'
                      }`}></div>
                      <div>
                        <div className="text-sm font-medium">
                          {order.status === 'CONFIRMED' && '订单确认'}
                          {order.status === 'ONGOING' && '租车开始'}
                          {order.status === 'COMPLETED' && '订单完成'}
                          {order.status === 'CANCELLED' && '订单取消'}
                          {order.status === 'REFUNDED' && '订单退款'}
                        </div>
                        <div className="text-xs text-gray-500">
                          当前状态
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 支付信息 */}
            {order.payments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>支付信息</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {order.payments.map((payment) => (
                    <div key={payment.id} className="flex justify-between items-center">
                      <div>
                        <div className="text-sm font-medium">
                          ¥{payment.amount.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {format(new Date(payment.createdAt), 'yyyy-MM-dd HH:mm', { locale: zhCN })}
                        </div>
                      </div>
                      <Badge variant={payment.status === 'SUCCESS' ? 'default' : 'secondary'}>
                        {payment.status === 'SUCCESS' ? '已支付' : payment.status === 'PENDING' ? '待支付' : '失败'}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}