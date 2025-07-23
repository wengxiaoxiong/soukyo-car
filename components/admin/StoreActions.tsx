'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Trash2, ToggleLeft } from 'lucide-react'
import { deleteStore, toggleStoreStatus } from '@/app/[locale]/admin/stores/actions'

interface StoreActionsProps {
  storeId: string
}

export function StoreActions({ storeId }: StoreActionsProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm('确定要删除这个店面吗？此操作不可撤销。')) {
      return
    }

    setIsLoading(true)
    try {
      await deleteStore(storeId)
    } catch {
      alert('删除失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleStatus = async () => {
    setIsLoading(true)
    try {
      await toggleStoreStatus(storeId)
    } catch {
      alert('状态切换失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={isLoading}>
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleToggleStatus}>
          <ToggleLeft className="w-4 h-4 mr-2" />
          切换状态
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} className="text-red-600">
          <Trash2 className="w-4 h-4 mr-2" />
          删除店面
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 