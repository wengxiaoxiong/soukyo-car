'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search } from 'lucide-react'
import { UserRole } from '@prisma/client'

export function UserSearchAndFilter() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('all')

  // 这里可以添加搜索和筛选逻辑，目前只是UI组件
  
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="搜索用户姓名或邮箱..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Select value={selectedRole} onValueChange={setSelectedRole}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="选择角色" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全部角色</SelectItem>
          <SelectItem value={UserRole.ADMIN}>管理员</SelectItem>
          <SelectItem value={UserRole.MANAGER}>经理</SelectItem>
          <SelectItem value={UserRole.USER}>用户</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
} 