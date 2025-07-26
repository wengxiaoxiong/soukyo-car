'use client'

import React, { useState } from 'react'
import { OrderStatus } from '@prisma/client'
import { updateOrderStatus } from '@/app/actions/orders'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { Eye, User, Car, CreditCard, Calendar, Phone, Mail, Package } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

type OrderData = {
  id: string
  orderNumber: string
  status: OrderStatus
  startDate: Date
  endDate: Date
  totalAmount: number
  createdAt: Date
  user: {
    id: string
    name: string | null
    email: string
    phone: string | null
  }
  vehicle: {
    id: string
    name: string
    brand: string
    model: string
    plateNumber: string | null
  } | null
  package: {
    id: string
    name: string
    description: string | null
    price: number
  } | null
  store: {
    id: string
    name: string
    address: string
  }
  payments: {
    id: string
    amount: number
    status: string
    createdAt: Date
  }[]
}

interface OrderTableProps {
  orders: OrderData[]
  onRefresh: () => void
}

export function OrderTable({ orders, onRefresh }: OrderTableProps) {
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null)

  // 状态标签配置
  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      PENDING: { label: '待处理', variant: 'secondary' as const },
      CONFIRMED: { label: '已确认', variant: 'default' as const },
      ONGOING: { label: '进行中', variant: 'default' as const },
      COMPLETED: { label: '已完成', variant: 'default' as const },
      CANCELLED: { label: '已取消', variant: 'destructive' as const },
      REFUNDED: { label: '已退款', variant: 'outline' as const }
    }

    const config = statusConfig[status]
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    )
  }

  // 格式化货币
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(amount)
  }

  // 格式化日期
  const formatDate = (date: Date) => {
    return format(new Date(date), 'yyyy年MM月dd日', { locale: zhCN })
  }

  // 格式化日期时间
  const formatDateTime = (date: Date) => {
    return format(new Date(date), 'yyyy-MM-dd HH:mm', { locale: zhCN })
  }

  // 更新订单状态
  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingOrder(orderId)
    try {
      const result = await updateOrderStatus(orderId, newStatus)
      if (result.success) {
        toast.success('订单状态更新成功')
        onRefresh()
      } else {
        toast.error(result.error || '更新订单状态失败')
      }
    } catch (error) {
      console.error('更新订单状态失败:', error)
      toast.error('更新订单状态失败')
    }
    setUpdatingOrder(null)
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-gray-500">
            <Car className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">暂无订单数据</p>
            <p className="text-sm">当前筛选条件下没有找到订单</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* 桌面端表格 */}
      <div className="hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>订单信息</TableHead>
              <TableHead>客户信息</TableHead>
              <TableHead>商品信息</TableHead>
              <TableHead>租期</TableHead>
              <TableHead>金额</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-sm text-gray-500">
                      {formatDateTime(order.createdAt)}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span className="text-sm font-medium">
                        {order.user.name || '未设置姓名'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Mail className="w-3 h-3" />
                      <span>{order.user.email}</span>
                    </div>
                    {order.user.phone && (
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Phone className="w-3 h-3" />
                        <span>{order.user.phone}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {order.vehicle ? (
                      <>
                        <div className="flex items-center gap-1">
                          <Car className="w-3 h-3" />
                          <span className="text-sm font-medium">{order.vehicle.name}</span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {order.vehicle.brand} {order.vehicle.model}
                        </p>
                        {order.vehicle.plateNumber && (
                          <p className="text-sm text-gray-500">
                            车牌: {order.vehicle.plateNumber}
                          </p>
                        )}
                      </>
                    ) : order.package ? (
                      <>
                        <div className="flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          <span className="text-sm font-medium">{order.package.name}</span>
                        </div>
                        {order.package.description && (
                          <p className="text-sm text-gray-500">
                            {order.package.description}
                          </p>
                        )}
                        <p className="text-sm text-blue-600">
                          套餐订单
                        </p>
                      </>
                    ) : (
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-gray-500">无商品信息</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span className="text-sm">
                        {formatDate(order.startDate)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      至 {formatDate(order.endDate)}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <CreditCard className="w-3 h-3" />
                    <span className="font-medium">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(order.status)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleStatusUpdate(order.id, value as OrderStatus)}
                      disabled={updatingOrder === order.id}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">待处理</SelectItem>
                        <SelectItem value="CONFIRMED">已确认</SelectItem>
                        <SelectItem value="ONGOING">进行中</SelectItem>
                        <SelectItem value="COMPLETED">已完成</SelectItem>
                        <SelectItem value="CANCELLED">已取消</SelectItem>
                        <SelectItem value="REFUNDED">已退款</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 移动端卡片布局 */}
      <div className="lg:hidden space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">
                    {formatDateTime(order.createdAt)}
                  </p>
                </div>
                {getStatusBadge(order.status)}
              </div>

              <div className="grid grid-cols-1 gap-3">
                {/* 客户信息 */}
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-700">客户信息</p>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span className="text-sm">{order.user.name || '未设置姓名'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Mail className="w-3 h-3" />
                    <span>{order.user.email}</span>
                  </div>
                </div>

                {/* 商品信息 */}
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-700">商品信息</p>
                  {order.vehicle ? (
                    <>
                      <div className="flex items-center gap-1">
                        <Car className="w-3 h-3" />
                        <span className="text-sm">{order.vehicle.name}</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {order.vehicle.brand} {order.vehicle.model}
                      </p>
                    </>
                  ) : order.package ? (
                    <>
                      <div className="flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        <span className="text-sm">{order.package.name}</span>
                      </div>
                      {order.package.description && (
                        <p className="text-sm text-gray-500">
                          {order.package.description}
                        </p>
                      )}
                      <p className="text-sm text-blue-600">套餐订单</p>
                    </>
                  ) : (
                    <span className="text-sm text-gray-500">无商品信息</span>
                  )}
                </div>

                {/* 租期和金额 */}
                <div className="flex justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-700">租期</p>
                    <p className="text-sm">
                      {formatDate(order.startDate)} 至 {formatDate(order.endDate)}
                    </p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-sm font-medium text-gray-700">金额</p>
                    <p className="text-sm font-medium">
                      {formatCurrency(order.totalAmount)}
                    </p>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-2 pt-2">
                  <Select
                    value={order.status}
                    onValueChange={(value) => handleStatusUpdate(order.id, value as OrderStatus)}
                    disabled={updatingOrder === order.id}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">待处理</SelectItem>
                      <SelectItem value="CONFIRMED">已确认</SelectItem>
                      <SelectItem value="ONGOING">进行中</SelectItem>
                      <SelectItem value="COMPLETED">已完成</SelectItem>
                      <SelectItem value="CANCELLED">已取消</SelectItem>
                      <SelectItem value="REFUNDED">已退款</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 