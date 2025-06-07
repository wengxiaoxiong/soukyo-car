'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, X } from 'lucide-react'

interface Store {
  id: string
  name: string
  city: string
}

interface VehicleFiltersProps {
  stores: Store[]
  totalPages: number
  currentPage: number
  searchValue?: string
  storeValue?: string
}

export function VehicleFilters({ 
  stores, 
  totalPages, 
  currentPage,
  searchValue = '',
  storeValue = ''
}: VehicleFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  const [search, setSearch] = useState(searchValue)
  const [selectedStore, setSelectedStore] = useState(storeValue || 'all')

  // 更新URL参数
  const updateParams = (params: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams(searchParams)
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value)
      } else {
        newParams.delete(key)
      }
    })
    
    // 重新设置为第一页
    if (params.search !== undefined || params.store !== undefined) {
      newParams.set('page', '1')
    }
    
    startTransition(() => {
      router.push(`/admin/vehicles?${newParams.toString()}`)
    })
  }

  // 处理搜索
  const handleSearch = () => {
    updateParams({ 
      search: search || undefined, 
      store: selectedStore && selectedStore !== 'all' ? selectedStore : undefined 
    })
  }

  // 处理清除筛选
  const handleClear = () => {
    setSearch('')
    setSelectedStore('all')
    startTransition(() => {
      router.push('/admin/vehicles')
    })
  }

  // 处理分页
  const handlePageChange = (page: number) => {
    updateParams({ page: page.toString() })
  }

  // 分页按钮数组
  const getPageButtons = () => {
    const buttons = []
    const showPages = 5 // 显示的页数
    const halfShow = Math.floor(showPages / 2)
    
    let startPage = Math.max(1, currentPage - halfShow)
    const endPage = Math.min(totalPages, startPage + showPages - 1)
    
    // 调整起始页，确保显示足够的页数
    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(1, endPage - showPages + 1)
    }
    
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(i)
    }
    
    return buttons
  }

  return (
    <div className="mb-6 space-y-4">
      {/* 搜索和筛选 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="搜索车辆名称、品牌、型号、车牌号或颜色..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10"
          />
        </div>
        
        <div className="w-full sm:w-48">
          <Select value={selectedStore} onValueChange={setSelectedStore}>
            <SelectTrigger>
              <SelectValue placeholder="选择店面" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有店面</SelectItem>
              {stores.map((store) => (
                <SelectItem key={store.id} value={store.id}>
                  {store.name} ({store.city})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleSearch} disabled={isPending}>
            搜索
          </Button>
          {(search || (selectedStore && selectedStore !== 'all')) && (
            <Button variant="outline" onClick={handleClear} disabled={isPending}>
              <X className="w-4 h-4 mr-2" />
              清除
            </Button>
          )}
        </div>
      </div>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1 || isPending}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            上一页
          </Button>
          
          {getPageButtons().map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              disabled={isPending}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}
          
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages || isPending}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            下一页
          </Button>
        </div>
      )}
    </div>
  )
} 