'use client'

import React from 'react'
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export interface VehicleFiltersProps {
  brands?: string[]
  cities?: string[]
  filters: {
    brand?: string
    minPrice?: number
    maxPrice?: number
    seats?: number
    city?: string
  }
  onFiltersChange: (filters: {
    brand?: string
    minPrice?: number
    maxPrice?: number
    seats?: number
    city?: string
  }) => void
}

export const VehicleFilters: React.FC<VehicleFiltersProps> = ({
  brands = [],
  cities = [],
  filters,
  onFiltersChange
}) => {
  const handleFilterChange = (key: string, value: string | number | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = value ? parseFloat(value) : undefined
    if (type === 'min') {
      onFiltersChange({
        ...filters,
        minPrice: numValue
      })
    } else {
      onFiltersChange({
        ...filters,
        maxPrice: numValue
      })
    }
  }

  const clearFilters = () => {
    onFiltersChange({})
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '')

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">筛选条件</h3>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="text-sm"
          >
            <X className="w-4 h-4 mr-1" />
            清空筛选
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* 品牌筛选 */}
        <div className="space-y-2">
          <Label htmlFor="brand">品牌</Label>
          <Select
            value={filters.brand || 'all'}
            onValueChange={(value) => handleFilterChange('brand', value === 'all' ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择品牌" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部品牌</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 座位数筛选 */}
        <div className="space-y-2">
          <Label htmlFor="seats">座位数</Label>
          <Select
            value={filters.seats?.toString() || 'all'}
            onValueChange={(value) => handleFilterChange('seats', value === 'all' ? undefined : parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择座位数" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">不限座位数</SelectItem>
              <SelectItem value="2">2座</SelectItem>
              <SelectItem value="4">4座</SelectItem>
              <SelectItem value="5">5座</SelectItem>
              <SelectItem value="7">7座</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 城市筛选 */}
        <div className="space-y-2">
          <Label htmlFor="city">城市</Label>
          <Select
            value={filters.city || 'all'}
            onValueChange={(value) => handleFilterChange('city', value === 'all' ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择城市" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部城市</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 价格筛选 */}
        <div className="space-y-2">
          <Label>日租金范围（元）</Label>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              placeholder="最低价"
              value={filters.minPrice || ''}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              className="flex-1"
            />
            <span className="text-gray-500">-</span>
            <Input
              type="number"
              placeholder="最高价"
              value={filters.maxPrice || ''}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </Card>
  )
} 