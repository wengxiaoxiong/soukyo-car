'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, MapPin, Car, CreditCard, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import Image from 'next/image'

interface Order {
  id: string
  orderNumber: string
  status: 'PENDING' | 'CONFIRMED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED'
  startDate: string
  endDate: string
  totalDays: number
  totalAmount: number
  createdAt: string
  vehicle?: {
    id: string
    name: string
    brand: string
    model: string
    year: number
    images: string[]
  } | null
  package?: {
    id: string
    name: string
    description?: string
    images: string[]
    price: number
  } | null
  store: {
    id: string
    name: string
    address: string
    city: string
  }
  payments: Array<{
    id: string
    status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED'
    amount: number
  }>
}

interface OrderListProps {
  orders: Order[]
  onViewDetails: (orderId: string) => void
  onCancelOrder: (orderId: string) => void
  onPayOrder?: (orderId: string) => void
  loading?: boolean
}

const statusConfig = {
  PENDING: { label: '待支付', color: 'bg-yellow-100 text-yellow-800' },
  CONFIRMED: { label: '已确认', color: 'bg-blue-100 text-blue-800' },
  ONGOING: { label: '进行中', color: 'bg-green-100 text-green-800' },
  COMPLETED: { label: '已完成', color: 'bg-gray-100 text-gray-800' },
  CANCELLED: { label: '已取消', color: 'bg-red-100 text-red-800' },
  REFUNDED: { label: '已退款', color: 'bg-purple-100 text-purple-800' }
}

export function OrderList({ orders, onViewDetails, onCancelOrder, onPayOrder, loading = false }: OrderListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">暂无订单</h3>
        <p className="text-gray-500">您还没有任何订单</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => {
        const statusInfo = statusConfig[order.status]
        const canCancel = order.status === 'PENDING' || order.status === 'CONFIRMED'
        const needsPayment = order.status === 'PENDING' && order.payments.some(payment => payment.status === 'PENDING')
        
        return (
          <Card key={order.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  订单号: {order.orderNumber}
                </CardTitle>
                <Badge className={statusInfo.color}>
                  {statusInfo.label}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>下单时间: {format(new Date(order.createdAt), 'PPP HH:mm', { locale: zhCN })}</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* 车辆/套餐信息 */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden relative">
                  {order.vehicle?.images && order.vehicle.images.length > 0 ? (
                    <Image 
                      src={order.vehicle.images[0]} 
                      alt={order.vehicle?.name || '车辆图片'}
                      fill
                      className="object-cover"
                    />
                  ) : order.package?.images && order.package.images.length > 0 ? (
                    <Image 
                      src={order.package.images[0]} 
                      alt={order.package?.name || '套餐图片'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Car className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  {order.vehicle ? (
                    <>
                      <h4 className="font-medium text-gray-900">{order.vehicle.name}</h4>
                      <p className="text-sm text-gray-600">
                        {order.vehicle.brand} {order.vehicle.model} • {order.vehicle.year}年
                      </p>
                    </>
                  ) : order.package ? (
                    <>
                      <h4 className="font-medium text-gray-900">{order.package.name}</h4>
                      <p className="text-sm text-gray-600">
                        {order.package.description || '套餐服务'}
                      </p>
                    </>
                  ) : (
                    <>
                      <h4 className="font-medium text-gray-900">订单信息不可用</h4>
                      <p className="text-sm text-gray-600">详情不可用</p>
                    </>
                  )}
                  <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>{order.store.name}</span>
                  </div>
                </div>
              </div>

              {/* 租期信息 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-gray-500">{order.vehicle ? '取车日期' : '购买日期'}</p>
                    <p className="font-medium">{format(new Date(order.startDate), 'PPP', { locale: zhCN })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-red-500" />
                  <div>
                    <p className="text-gray-500">{order.vehicle ? '还车日期' : '有效期至'}</p>
                    <p className="font-medium">{format(new Date(order.endDate), 'PPP', { locale: zhCN })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="text-gray-500">总金额</p>
                    <p className="font-medium text-lg">JPY{order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* 支付状态 */}
              {order.payments.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="w-4 h-4" />
                  <span className="text-gray-500">支付状态:</span>
                  {order.payments.map((payment) => (
                    <Badge 
                      key={payment.id}
                      variant={payment.status === 'SUCCESS' ? 'default' : payment.status === 'FAILED' ? 'destructive' : 'secondary'}
                    >
                      {payment.status === 'SUCCESS' ? '已支付' : 
                       payment.status === 'PENDING' ? '待支付' : 
                       payment.status === 'FAILED' ? '支付失败' : 
                       payment.status === 'REFUNDED' ? '已退款' : '未知状态'}
                    </Badge>
                  ))}
                </div>
              )}

              {/* 操作按钮 */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => onViewDetails(order.id)}
                  className="flex-1"
                >
                  查看详情
                </Button>
                {needsPayment && onPayOrder && (
                  <Button
                    onClick={() => onPayOrder(order.id)}
                    className="flex-1"
                  >
                    立即支付
                  </Button>
                )}
                {canCancel && (
                  <Button
                    variant="destructive"
                    onClick={() => onCancelOrder(order.id)}
                    className="flex-1"
                  >
                    取消订单
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
} 