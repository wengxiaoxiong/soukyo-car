'use client'

import React, { useState, useEffect } from 'react'
import { PackageCard } from '@/components/PackageCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, MapPin, Package, Filter, X } from 'lucide-react'
import { getAllPackages, PackageWithStore } from '@/lib/actions/packages'
import { getActiveStores, StoreWithOpeningHours } from '@/app/actions/stores'

export default function PackagePage() {
  const [packages, setPackages] = useState<PackageWithStore[]>([])
  const [stores, setStores] = useState<StoreWithOpeningHours[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStore, setSelectedStore] = useState('')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [showFilters, setShowFilters] = useState(false)

  // 获取初始数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [packagesData, storesData] = await Promise.all([
          getAllPackages(),
          getActiveStores()
        ])
        setPackages(packagesData)
        setStores(storesData)
      } catch (error) {
        console.error('获取数据失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // 筛选套餐
  const handleFilter = async () => {
    setLoading(true)
    try {
      const params = {
        ...(searchTerm && { search: searchTerm }),
        ...(selectedStore && { storeId: selectedStore }),
        ...(priceRange.min && { minPrice: parseFloat(priceRange.min) }),
        ...(priceRange.max && { maxPrice: parseFloat(priceRange.max) })
      }
      
      const filteredPackages = await getAllPackages(params)
      setPackages(filteredPackages)
    } catch (error) {
      console.error('筛选失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 清除筛选
  const clearFilters = () => {
    setSearchTerm('')
    setSelectedStore('')
    setPriceRange({ min: '', max: '' })
    setShowFilters(false)
  }

  // 当筛选条件改变时自动筛选
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleFilter()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, selectedStore, priceRange])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              精选套餐
            </h1>
            <p className="text-lg text-gray-600">
              发现最适合您的出行套餐
            </p>
          </div>

          {/* 搜索和筛选 */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* 搜索框 */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="搜索套餐名称..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>

              {/* 筛选按钮 */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="h-12 px-6 flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                筛选
              </Button>
            </div>

            {/* 筛选面板 */}
            {showFilters && (
              <div className="bg-white rounded-lg p-6 shadow-sm border mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">筛选选项</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-4 h-4 mr-1" />
                    清除
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* 门店选择 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      门店
                    </label>
                    <Select value={selectedStore} onValueChange={setSelectedStore}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择门店" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">全部门店</SelectItem>
                        {stores.map((store) => (
                          <SelectItem key={store.id} value={store.id}>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {store.name} - {store.city}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 价格范围 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      最低价格
                    </label>
                    <Input
                      type="number"
                      placeholder="最低价格"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      最高价格
                    </label>
                    <Input
                      type="number"
                      placeholder="最高价格"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 套餐列表 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">加载中...</p>
          </div>
        ) : packages.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                共找到 <span className="font-semibold text-gray-900">{packages.length}</span> 个套餐
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {packages.map((pkg) => (
                <PackageCard key={pkg.id} {...pkg} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Package className="w-24 h-24 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">暂无套餐</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedStore || priceRange.min || priceRange.max
                ? '没有符合条件的套餐，请尝试调整筛选条件'
                : '管理员正在添加套餐信息'}
            </p>
            {(searchTerm || selectedStore || priceRange.min || priceRange.max) && (
              <Button onClick={clearFilters} variant="outline">
                清除筛选条件
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}