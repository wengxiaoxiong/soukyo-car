'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, ToggleLeft, Trash2 } from 'lucide-react'
import { deleteVehicle, toggleVehicleAvailability } from '@/app/admin/vehicles/actions'

interface VehicleActionsProps {
  vehicleId: string
}

export function VehicleActions({ vehicleId }: VehicleActionsProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm('确定要删除这个车辆吗？此操作不可撤销。')) {
      return
    }

    setIsLoading(true)
    try {
      await deleteVehicle(vehicleId)
    } catch {
      alert('删除失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleAvailability = async () => {
    setIsLoading(true)
    try {
      await toggleVehicleAvailability(vehicleId)
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
        <DropdownMenuItem onClick={handleToggleAvailability}>
          <ToggleLeft className="w-4 h-4 mr-2" />
          切换状态
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} className="text-red-600">
          <Trash2 className="w-4 h-4 mr-2" />
          删除车辆
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 