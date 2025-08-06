'use client'

import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { PackageCard } from '@/components/PackageCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Package, Filter, X, SortAsc } from 'lucide-react'
import { getAllPackages, Package as PackageType } from '@/lib/actions/packages'


export default function PackagePage() {
  const t = useTranslations()
  const [packages, setPackages] = useState<PackageType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<'default' | 'capacity'>('default')

  // 获取初始数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        const packagesData = await getAllPackages()
        setPackages(packagesData)
      } catch (error) {
        console.error('Failed to fetch data:', error)
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
    setPriceRange({ min: '', max: '' })
    setShowFilters(false)
  }

  // 从套餐名称中提取人数
  const extractCapacity = (name: string): number => {
    const match = name.match(/(\d+)人/)
    return match ? parseInt(match[1]) : 0
  }

  // 排序套餐
  const sortPackages = (packagesToSort: PackageType[]) => {
    if (sortBy === 'capacity') {
      return [...packagesToSort].sort((a, b) => {
        const capacityA = extractCapacity(a.name)
        const capacityB = extractCapacity(b.name)
        return capacityA - capacityB // 从小到大排序
      })
    }
    return packagesToSort
  }

  // 当筛选条件改变时自动筛选
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleFilter()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, priceRange])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('packages.title')}
            </h1>
            <p className="text-lg text-gray-600">
              {t('packages.description')}
            </p>
          </div>

          {/* 搜索和筛选 */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* 搜索框 */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder={t('search.search_placeholder')}
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
                {t('common.filter')}
              </Button>

              {/* 排序选择器 */}
              <Button
                variant="outline"
                onClick={() => setSortBy(sortBy === 'default' ? 'capacity' : 'default')}
                className="h-12 px-6 flex items-center gap-2"
              >
                <SortAsc className="w-4 h-4" />
                {sortBy === 'default' ? '默认排序' : '按人数排序'}
              </Button>
            </div>

            {/* 筛选面板 */}
            {showFilters && (
              <div className="bg-white rounded-lg p-6 shadow-sm border mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{t('search.filter_results')}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-4 h-4 mr-1" />
                    {t('common.clear')}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 价格范围 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('common.price')} ({t('common.currency')})
                    </label>
                    <Input
                      type="number"
                      placeholder={t('common.price')}
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('common.price')} ({t('common.currency')})
                    </label>
                    <Input
                      type="number"
                      placeholder={t('common.price')}
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
            <p className="text-gray-600">{t('common.loading')}</p>
          </div>
        ) : packages.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {t('search.results_count', { count: packages.length })}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortPackages(packages).map((pkg) => (
                <PackageCard key={pkg.id} {...pkg} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Package className="w-24 h-24 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('packages.title')}</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || priceRange.min || priceRange.max
                ? t('search.no_results')
                : t('packages.description')}
            </p>
            {(searchTerm || priceRange.min || priceRange.max) && (
              <Button onClick={clearFilters} variant="outline">
                {t('common.clear')}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}