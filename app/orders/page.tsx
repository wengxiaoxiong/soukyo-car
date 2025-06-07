'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { OrderList } from '@/components/OrderList'
import { getUserOrders, cancelOrder } from '@/lib/actions/booking'
import { useSession } from 'next-auth/react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function OrdersPage() {
  const router = useRouter()
  const { status } = useSession()
  const [orders, setOrders] = useState<Parameters<typeof OrderList>[0]['orders']>([])
  const [loading, setLoading] = useState(true)

  // 获取订单列表
  const fetchOrders = async () => {
    setLoading(true)
    try {
      const result = await getUserOrders()
      if (result.success) {
        // 转换数据格式以匹配组件期望的类型
        const transformedOrders = (result.orders || []).map(order => ({
          ...order,
          startDate: order.startDate.toString(),
          endDate: order.endDate.toString(),
          createdAt: order.createdAt.toString()
        }))
        setOrders(transformedOrders as Parameters<typeof OrderList>[0]['orders'])
      } else {
        toast.error(result.error || '获取订单列表失败')
      }
    } catch {
      toast.error('获取订单列表失败')
    }
    setLoading(false)
  }

  useEffect(() => {
    if (status === 'unauthenticated') {
      toast.error('请先登录')
      router.push('/auth/signin')
      return
    }

    if (status === 'authenticated') {
      fetchOrders()
    }
  }, [status, router])

  const handleViewDetails = (orderId: string) => {
    router.push(`/orders/${orderId}`)
  }

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('确定要取消这个订单吗？')) {
      return
    }

    try {
      const result = await cancelOrder(orderId)
      if (result.success) {
        toast.success('订单已取消')
        fetchOrders() // 重新获取订单列表
      } else {
        toast.error(result.error || '取消订单失败')
      }
    } catch {
      toast.error('取消订单失败')
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">正在加载...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面标题 */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">我的订单</h1>
          <p className="text-gray-600">
            查看和管理您的租车订单
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        <OrderList
          orders={orders}
          onViewDetails={handleViewDetails}
          onCancelOrder={handleCancelOrder}
          loading={loading}
        />
      </div>
    </div>
  )
} 