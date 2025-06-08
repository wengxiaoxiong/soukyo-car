'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { VehicleFilters } from '@/components/VehicleFilters'
import { CarCard } from '@/components/CarCard'
import { Pagination } from '@/components/Pagination'
import { getVehicleList } from '@/lib/actions/cars'
import { getActiveStores } from '@/app/actions/stores'
import type { CarCardData, VehicleFilters as FilterType } from '@/lib/actions/cars'
import { Loader2 } from 'lucide-react'

// 预定义的品牌列表，避免每次从数据库获取
const PREDEFINED_BRANDS = [
  '丰田',
  '本田',
  '大众',
  '奥迪',
  '宝马',
  '奔驰',
  '日产',
  '马自达',
  '现代',
  '起亚',
  '福特',
  '雪佛兰',
  '特斯拉',
  '哈弗',
  '奇瑞'
].sort()

export default function VehiclePage() {
  const searchParams = useSearchParams()
  const [vehicles, setVehicles] = useState<CarCardData[]>([])
  const [loading, setLoading] = useState(true)
  const [stores, setStores] = useState<Array<{id: string, name: string, city: string}>>([])
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [filters, setFilters] = useState<FilterType>({
    isAvailable: true // 默认只显示可用车辆
  })
  const [searchConditions, setSearchConditions] = useState({
    startDate: '',
    endDate: '',
    passengers: '',
    storeId: ''
  })

  const pageSize = 12

  // 获取车辆列表
  const fetchVehicles = async () => {
    setLoading(true)
    try {
      const result = await getVehicleList(currentPage, pageSize, filters)
      setVehicles(result.vehicles)
      setTotalPages(result.totalPages)
      setTotal(result.total)
    } catch (error) {
      console.error('获取车辆列表失败:', error)
    }
    setLoading(false)
  }

  // 获取店面列表（只获取一次）
  const fetchStores = async () => {
    try {
      const storesData = await getActiveStores()
      setStores(storesData.map(store => ({
        id: store.id,
        name: store.name,
        city: store.city
      })))
    } catch (error) {
      console.error('获取店面列表失败:', error)
    }
  }

  // 从query参数初始化搜索条件
  useEffect(() => {
    const startDate = searchParams.get('startDate') || ''
    const endDate = searchParams.get('endDate') || ''
    const passengers = searchParams.get('passengers') || ''
    const storeId = searchParams.get('storeId') || ''

    setSearchConditions({
      startDate,
      endDate,
      passengers,
      storeId
    })

    // 如果有storeId参数，自动设置到筛选条件中
    if (storeId) {
      setFilters(prev => ({
        ...prev,
        storeId,
        isAvailable: true
      }))
    }
  }, [searchParams])

  // 初始化数据
  useEffect(() => {
    fetchStores()
  }, [])

  // 当页码或筛选条件改变时重新获取数据
  useEffect(() => {
    fetchVehicles()
  }, [currentPage, filters])

  // 处理筛选条件变化
  const handleFiltersChange = (newFilters: FilterType) => {
    setFilters({ ...newFilters, isAvailable: true }) // 始终只显示可用车辆
    setCurrentPage(1) // 重置到第一页
  }

  // 处理页码变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // 滚动到页面顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 处理预订点击
  const handleBookClick = (carId: string) => {
    window.location.href = `/booking/${carId}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* 页面标题 */}
      <div className="bg-white border-b">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">全部车型</h1>
          <p className="text-gray-600">
            为您精选优质租车服务，共找到 {total} 辆车
          </p>
          {/* 显示搜索条件 */}
          {(searchConditions.startDate || searchConditions.endDate) && (
            <div className="mt-4 text-sm text-gray-500 flex flex-wrap gap-4">
              {searchConditions.startDate && searchConditions.endDate && (
                <span>📅 {searchConditions.startDate} 至 {searchConditions.endDate}</span>
              )}
              {searchConditions.passengers && (
                <span>👥 {searchConditions.passengers}人</span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 左侧筛选面板 */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-8">
              <VehicleFilters
                brands={PREDEFINED_BRANDS}
                stores={stores}
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </div>
          </div>

          {/* 右侧车辆列表 */}
          <div className="lg:col-span-3">
            {loading ? (
              // 加载状态
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">正在加载车辆信息...</span>
              </div>
            ) : vehicles.length > 0 ? (
              <>
                {/* 车辆网格 */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {vehicles.map((vehicle) => (
                    <CarCard 
                      key={vehicle.id} 
                      {...vehicle}
                      onBookClick={handleBookClick}
                    />
                  ))}
                </div>

                {/* 分页组件 */}
                <div className="flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            ) : (
              // 无结果状态
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  未找到符合条件的车辆
                </h3>
                <p className="text-gray-500">
                  请尝试调整筛选条件，或联系客服了解更多车辆信息
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 