'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserRole } from '@prisma/client'
import { createUser } from '@/app/admin/users/actions'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { UserCog, Shield, ShieldCheck } from 'lucide-react'

interface AddUserDialogProps {
  children: React.ReactNode
}

export function AddUserDialog({ children }: AddUserDialogProps) {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: UserRole.USER,
    phone: ''
  })

  const currentUserRole = session?.user?.role as UserRole
  const isAdmin = currentUserRole === UserRole.ADMIN

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('两次输入的密码不一致')
      return
    }
    
    if (formData.password.length < 6) {
      toast.error('密码长度至少6位')
      return
    }
    
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('请填写用户姓名和邮箱')
      return
    }

    setLoading(true)
    try {
      const result = await createUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
        phone: formData.phone.trim() || undefined
      })
      
      if (result.success) {
        toast.success(result.message)
        setOpen(false)
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: UserRole.USER,
          phone: ''
        })
      } else {
        toast.error(result.message)
      }
    } catch {
      toast.error('创建用户失败')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>添加新用户</DialogTitle>
          <DialogDescription>
            创建新的系统用户账户并设置相应权限
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">姓名 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="请输入用户姓名"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">电话</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="请输入电话号码"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="email">邮箱 *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="请输入邮箱地址"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="password">密码 *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="至少6位密码"
                required
                minLength={6}
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">确认密码 *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="再次输入密码"
                required
                minLength={6}
              />
            </div>
          </div>
          
          <div>
            <Label>用户角色</Label>
            <Select 
              value={formData.role} 
              onValueChange={(value) => handleInputChange('role', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserRole.USER}>
                  <div className="flex items-center">
                    <UserCog className="w-4 h-4 mr-2" />
                    用户 - 基础权限
                  </div>
                </SelectItem>
                <SelectItem value={UserRole.MANAGER}>
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    经理 - 管理权限
                  </div>
                </SelectItem>
                {isAdmin && (
                  <SelectItem value={UserRole.ADMIN}>
                    <div className="flex items-center">
                      <ShieldCheck className="w-4 h-4 mr-2" />
                      管理员 - 完全权限
                    </div>
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '创建中...' : '创建用户'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 