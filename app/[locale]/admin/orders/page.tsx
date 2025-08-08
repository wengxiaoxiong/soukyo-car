'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { OrderStatus } from '@prisma/client'
import { getAdminOrders, getOrderStats, type OrderFilters } from '@/app/actions/orders'
import { OrderTable } from '@/components/admin/OrderTable'
import { OrderFilters as OrderFiltersComponent } from '@/components/admin/OrderFilters'
import { OrderStats } from '@/components/admin/OrderStats'
import { Pagination } from '@/components/admin/Pagination'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Search, Filter, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'


// 订单数据类型
type OrderData = NonNullable<Awaited<ReturnType<typeof getAdminOrders>>['data']>
type OrderStatsData = NonNullable<Awaited<ReturnType<typeof getOrderStats>>['stats']>

function AdminOrdersContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // 状态管理
  const [orders, setOrders] = useState<OrderData['orders']>([])
  const [pagination, setPagination] = useState<OrderData['pagination']>({
    page: 1,
    pageSize: 20,
    totalCount: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  })
  const [stats, setStats] = useState<OrderStatsData>({
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    ongoingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0
  })
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)
  
  // 筛选条件
  const [filters, setFilters] = useState<OrderFilters>({
    page: parseInt(searchParams.get('page') || '1'),
    pageSize: parseInt(searchParams.get('pageSize') || '20'),
    status: (searchParams.get('status') as OrderStatus) || 'ALL',
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
    search: searchParams.get('search') || ''
  })
  
  // 临时搜索输入
  const [searchInput, setSearchInput] = useState(filters.search || '')
  
  // 获取订单数据
  const fetchOrders = async (newFilters?: OrderFilters) => {
    setLoading(true)
    try {
      const filtersToUse = newFilters || filters
      const result = await getAdminOrders(filtersToUse)
      
      if (result && result.success && result.data) {
        setOrders(result.data.orders)
        setPagination(result.data.pagination)
      } else {
        toast.error(result?.error || '获取订单列表失败')
      }
    } catch (error) {
      console.error('获取订单列表失败:', error)
      toast.error('获取订单列表失败')
    }
    setLoading(false)
  }
  
  // 获取统计数据
  const fetchStats = async () => {
    setStatsLoading(true)
    try {
      const result = await getOrderStats()
      
      if (result && result.success && result.stats) {
        setStats(result.stats)
      } else {
        toast.error(result?.error || '获取统计数据失败')
      }
    } catch (error) {
      console.error('获取统计数据失败:', error)
      toast.error('获取统计数据失败')
    }
    setStatsLoading(false)
  }
  
  // 初始加载
  useEffect(() => {
    fetchOrders()
    fetchStats()
  }, [])
  
  // 更新URL参数
  const updateURLParams = (newFilters: OrderFilters) => {
    const params = new URLSearchParams()
    
    if (newFilters.page && newFilters.page > 1) {
      params.set('page', newFilters.page.toString())
    }
    if (newFilters.pageSize && newFilters.pageSize !== 20) {
      params.set('pageSize', newFilters.pageSize.toString())
    }
    if (newFilters.status && newFilters.status !== 'ALL') {
      params.set('status', newFilters.status)
    }
    if (newFilters.startDate) {
      params.set('startDate', newFilters.startDate)
    }
    if (newFilters.endDate) {
      params.set('endDate', newFilters.endDate)
    }
    if (newFilters.search) {
      params.set('search', newFilters.search)
    }
    
    const queryString = params.toString()
    const newUrl = queryString ? `?${queryString}` : ''
    router.push(`/admin/orders${newUrl}`, { scroll: false })
  }
  
  // 处理筛选条件变化
  const handleFiltersChange = (newFilters: Partial<OrderFilters>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 }
    setFilters(updatedFilters)
    updateURLParams(updatedFilters)
    fetchOrders(updatedFilters)
  }
  
  // 处理分页
  const handlePageChange = (page: number) => {
    const updatedFilters = { ...filters, page }
    setFilters(updatedFilters)
    updateURLParams(updatedFilters)
    fetchOrders(updatedFilters)
  }
  
  // 处理搜索
  const handleSearch = () => {
    handleFiltersChange({ search: searchInput })
  }
  
  // 处理重置筛选
  const handleResetFilters = () => {
    const resetFilters: OrderFilters = {
      page: 1,
      pageSize: 20,
      status: 'ALL',
      startDate: '',
      endDate: '',
      search: ''
    }
    setFilters(resetFilters)
    setSearchInput('')
    updateURLParams(resetFilters)
    fetchOrders(resetFilters)
  }
  
  // 处理刷新
  const handleRefresh = () => {
    fetchOrders()
    fetchStats()
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">订单管理</h1>
          <p className="text-gray-600 mt-2">管理和监控所有租车订单</p>
        </div>
        <Button onClick={handleRefresh} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          刷新
        </Button>
      </div>

      {/* 统计卡片 */}
      <OrderStats stats={stats} loading={statsLoading} />

      {/* 筛选器 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            筛选条件
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 搜索框 */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="搜索订单ID、用户名、邮箱、电话、车辆或套餐..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full"
              />
            </div>
            <Button onClick={handleSearch} className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              搜索
            </Button>
          </div>

          {/* 其他筛选器 */}
          <OrderFiltersComponent
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />

          {/* 操作按钮 */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleResetFilters}>
              重置筛选
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 订单表格 */}
      <Card>
        <CardHeader>
          <CardTitle>订单列表</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2">加载中...</span>
            </div>
          ) : (
            <>
              <OrderTable orders={orders} onRefresh={handleRefresh} />
                             <div className="mt-6">
                 <Pagination
                   currentPage={pagination.page}
                   totalPages={pagination.totalPages}
                   onPageChange={handlePageChange}
                   hasNextPage={pagination.hasNextPage}
                   hasPrevPage={pagination.hasPrevPage}
                 />
               </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">加载中...</h2>
        <p className="text-gray-600">请稍候</p>
      </div>
    </div>
  )
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AdminOrdersContent />
    </Suspense>
  )
} 