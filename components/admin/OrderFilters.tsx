'use client'

import React from 'react'
import { OrderStatus } from '@prisma/client'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'

interface OrderFiltersProps {
  filters: {
    status?: OrderStatus | 'ALL'
    startDate?: string
    endDate?: string
    pageSize?: number
  }
  onFiltersChange: (filters: Partial<OrderFiltersProps['filters']>) => void
}

export function OrderFilters({ filters, onFiltersChange }: OrderFiltersProps) {
  const statusOptions = [
    { value: 'ALL', label: '全部状态' },
    { value: 'PENDING', label: '待处理' },
    { value: 'CONFIRMED', label: '已确认' },
    { value: 'ONGOING', label: '进行中' },
    { value: 'COMPLETED', label: '已完成' },
    { value: 'CANCELLED', label: '已取消' },
    { value: 'REFUNDED', label: '已退款' }
  ]

  const pageSizeOptions = [
    { value: 10, label: '10条/页' },
    { value: 20, label: '20条/页' },
    { value: 50, label: '50条/页' },
    { value: 100, label: '100条/页' }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 订单状态筛选 */}
      <div className="space-y-2">
        <Label htmlFor="status">订单状态</Label>
        <Select
          value={filters.status || 'ALL'}
          onValueChange={(value) => onFiltersChange({ status: value as OrderStatus | 'ALL' })}
        >
          <SelectTrigger>
            <SelectValue placeholder="选择状态" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 开始日期 */}
      <div className="space-y-2">
        <Label htmlFor="startDate">开始日期</Label>
        <Input
          id="startDate"
          type="date"
          value={filters.startDate || ''}
          onChange={(e) => onFiltersChange({ startDate: e.target.value })}
        />
      </div>

      {/* 结束日期 */}
      <div className="space-y-2">
        <Label htmlFor="endDate">结束日期</Label>
        <Input
          id="endDate"
          type="date"
          value={filters.endDate || ''}
          onChange={(e) => onFiltersChange({ endDate: e.target.value })}
        />
      </div>

      {/* 每页显示数量 */}
      <div className="space-y-2">
        <Label htmlFor="pageSize">每页显示</Label>
        <Select
          value={filters.pageSize?.toString() || '20'}
          onValueChange={(value) => onFiltersChange({ pageSize: parseInt(value) })}
        >
          <SelectTrigger>
            <SelectValue placeholder="选择数量" />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
} 