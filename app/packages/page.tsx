'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PackageCard } from '@/components/PackageCard'
import { PackageCardData, getPackageList, PackageFilters } from '@/lib/actions/packages'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Loader2, Search, Filter, X } from 'lucide-react'
import { toast } from 'sonner'

export default function PackagesPage() {
  const router = useRouter()
  const [packages, setPackages] = useState<PackageCardData[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [filters, setFilters] = useState<PackageFilters>({
    isActive: true,
    isPublished: true
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [showFilters, setShowFilters] = useState(false)

  const pageSize = 12

  // 获取套餐列表
  const fetchPackages = async () => {
    setLoading(true)
    try {
      const currentFilters: PackageFilters = {
        ...filters,
        search: searchQuery || undefined,
        category: selectedCategory || undefined,
        minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
        maxPrice: priceRange[1] < 10000 ? priceRange[1] : undefined
      }

      const result = await getPackageList(currentPage, pageSize, currentFilters)
      setPackages(result.packages)
      setTotalPages(result.totalPages)
      setTotal(result.total)
    } catch (error) {
      console.error('获取套餐列表失败:', error)
      toast.error('获取套餐列表失败')
    }
    setLoading(false)
  }

  // 初始加载和条件变化时获取数据
  useEffect(() => {
    fetchPackages()
  }, [currentPage, filters, searchQuery, selectedCategory, priceRange])

  // 处理搜索
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  // 处理分类筛选
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  // 处理价格范围变化
  const handlePriceRangeChange = (value: [number, number]) => {
    setPriceRange(value)
    setCurrentPage(1)
  }

  // 清除筛选条件
  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setPriceRange([0, 10000])
    setCurrentPage(1)
  }

  // 处理查看详情
  const handleViewDetails = (packageId: string) => {
    router.push(`/packages/${packageId}`)
  }

  // 处理购买
  const handleBuy = (packageId: string) => {
    router.push(`/packages/${packageId}/order`)
  }

  // 处理分页
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面标题 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">精选套餐</h1>
          <p className="text-gray-600">
            为您精选优质套餐服务，共找到 {total} 个套餐
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* 左侧筛选面板 */}
          <div className="w-80 hidden lg:block">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>筛选条件</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-sm"
                  >
                    <X className="w-4 h-4 mr-1" />
                    清除
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 搜索 */}
                <div>
                  <label className="block text-sm font-medium mb-2">搜索</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="搜索套餐..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* 分类筛选 */}
                <div>
                  <label className="block text-sm font-medium mb-2">分类</label>
                  <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择分类" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">全部分类</SelectItem>
                      <SelectItem value="美食">美食</SelectItem>
                      <SelectItem value="旅游">旅游</SelectItem>
                      <SelectItem value="生活">生活</SelectItem>
                      <SelectItem value="娱乐">娱乐</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 价格范围 */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    价格范围: ¥{priceRange[0]} - ¥{priceRange[1]}
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={handlePriceRangeChange}
                    max={10000}
                    min={0}
                    step={100}
                    className="mt-2"
                  />
                </div>

                {/* 活跃筛选标签 */}
                <div className="flex flex-wrap gap-2">
                  {searchQuery && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      搜索: {searchQuery}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => handleSearch('')}
                      />
                    </Badge>
                  )}
                  {selectedCategory && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      分类: {selectedCategory}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => handleCategoryChange('')}
                      />
                    </Badge>
                  )}
                  {(priceRange[0] > 0 || priceRange[1] < 10000) && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      价格: ¥{priceRange[0]}-¥{priceRange[1]}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => handlePriceRangeChange([0, 10000])}
                      />
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧套餐列表 */}
          <div className="flex-1">
            {/* 移动端筛选按钮 */}
            <div className="lg:hidden mb-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full"
              >
                <Filter className="w-4 h-4 mr-2" />
                筛选条件
              </Button>
            </div>

            {loading ? (
              // 加载状态
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">正在加载套餐...</span>
              </div>
            ) : packages.length > 0 ? (
              <>
                {/* 套餐网格 */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {packages.map((package_) => (
                    <PackageCard
                      key={package_.id}
                      {...package_}
                      onViewClick={handleViewDetails}
                      onBuyClick={handleBuy}
                    />
                  ))}
                </div>

                {/* 分页 */}
                {totalPages > 1 && (
                  <div className="flex justify-center">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                      >
                        上一页
                      </Button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          onClick={() => handlePageChange(page)}
                          className="w-10"
                        >
                          {page}
                        </Button>
                      ))}
                      
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                      >
                        下一页
                      </Button>
                    </div>
                  </div>
                )}
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
                  未找到符合条件的套餐
                </h3>
                <p className="text-gray-500">
                  请尝试调整筛选条件，或联系客服了解更多套餐信息
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}