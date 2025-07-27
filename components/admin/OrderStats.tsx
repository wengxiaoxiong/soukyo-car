'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { Loader2, TrendingUp, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react'

interface OrderStatsProps {
  stats: {
    totalOrders: number
    pendingOrders: number
    confirmedOrders: number
    ongoingOrders: number
    completedOrders: number
    cancelledOrders: number
    totalRevenue: number
  }
  loading?: boolean
}

export function OrderStats({ stats, loading }: OrderStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'JPY'
    }).format(amount)
  }

  const statsItems = [
    {
      title: '总订单数',
      value: stats.totalOrders,
      icon: TrendingUp,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: '待处理',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
    {
      title: '已确认',
      value: stats.confirmedOrders,
      icon: CheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: '进行中',
      value: stats.ongoingOrders,
      icon: RefreshCw,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    },
    {
      title: '已完成',
      value: stats.completedOrders,
      icon: CheckCircle,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600'
    },
    {
      title: '已取消',
      value: stats.cancelledOrders,
      icon: XCircle,
      color: 'bg-red-500',
      textColor: 'text-red-600'
    }
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* 数量统计 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statsItems.map((item, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {item.title}
                  </p>
                  <p className={`text-2xl font-bold ${item.textColor}`}>
                    {item.value.toLocaleString()}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${item.color} bg-opacity-10`}>
                  <item.icon className={`w-6 h-6 ${item.textColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 总收入 */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <TrendingUp className="w-5 h-5" />
            总收入
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-900">
            {formatCurrency(stats.totalRevenue)}
          </div>
          <p className="text-sm text-blue-600 mt-1">
            基于已确认、进行中和已完成的订单
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 