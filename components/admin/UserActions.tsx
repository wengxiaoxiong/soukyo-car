'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { 
  MoreHorizontal, 
  UserCog, 
  ToggleLeft, 
  Trash2, 
  Key,
  Shield,
  ShieldCheck
} from 'lucide-react'
import { UserRole } from '@prisma/client'
import { 
  updateUserRole, 
  toggleUserStatus, 
  deleteUser,
  resetUserPassword 
} from '@/app/[locale]/admin/users/actions'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'

interface UserActionsProps {
  user: {
    id: string
    name: string | null
    email: string
    role: UserRole
    isActive: boolean
  }
}

export function UserActions({ user }: UserActionsProps) {
  const { data: session } = useSession()
  const [roleDialogOpen, setRoleDialogOpen] = useState(false)
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<UserRole>(user.role)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const isCurrentUser = session?.user?.id === user.id
  const currentUserRole = session?.user?.role as UserRole
  const isAdmin = currentUserRole === UserRole.ADMIN

  const handleRoleUpdate = async (newRole: UserRole) => {
    setLoading(true)
    try {
      const result = await updateUserRole(user.id, newRole)
      if (result.success) {
        toast.success(result.message)
        setRoleDialogOpen(false)
      } else {
        toast.error(result.message)
      }
         } catch {
       toast.error('更新角色失败')
     } finally {
      setLoading(false)
    }
  }

  const handleStatusToggle = async () => {
    setLoading(true)
    try {
      const result = await toggleUserStatus(user.id)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
         } catch {
       toast.error('切换用户状态失败')
     } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('两次输入的密码不一致')
      return
    }
    
    if (newPassword.length < 6) {
      toast.error('密码长度至少6位')
      return
    }

    setLoading(true)
    try {
      const result = await resetUserPassword(user.id, newPassword)
      if (result.success) {
        toast.success(result.message)
        setPasswordDialogOpen(false)
        setNewPassword('')
        setConfirmPassword('')
      } else {
        toast.error(result.message)
      }
         } catch {
       toast.error('重置密码失败')
     } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      const result = await deleteUser(user.id)
      if (result.success) {
        toast.success(result.message)
        setDeleteDialogOpen(false)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
    console.log(error);
      toast.error('删除用户失败')
    } finally {
      setLoading(false)
    }
  }



  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem 
            onClick={() => setRoleDialogOpen(true)}
            disabled={isCurrentUser}
          >
            <UserCog className="mr-2 h-4 w-4" />
            修改角色
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={handleStatusToggle}
            disabled={isCurrentUser || loading}
          >
            <ToggleLeft className="mr-2 h-4 w-4" />
            {user.isActive ? '停用用户' : '激活用户'}
          </DropdownMenuItem>

          {isAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setPasswordDialogOpen(true)}
              >
                <Key className="mr-2 h-4 w-4" />
                重置密码
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => setDeleteDialogOpen(true)}
                disabled={isCurrentUser}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                删除用户
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 修改角色对话框 */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>修改用户角色</DialogTitle>
            <DialogDescription>
              为用户 {user.name || user.email} 设置新的角色权限
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>选择角色</Label>
              <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.USER}>
                    <div className="flex items-center">
                      <UserCog className="w-4 h-4 mr-2" />
                      用户
                    </div>
                  </SelectItem>
                  <SelectItem value={UserRole.MANAGER}>
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      经理
                    </div>
                  </SelectItem>
                  {isAdmin && (
                    <SelectItem value={UserRole.ADMIN}>
                      <div className="flex items-center">
                        <ShieldCheck className="w-4 h-4 mr-2" />
                        管理员
                      </div>
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>
              取消
            </Button>
            <Button 
              onClick={() => handleRoleUpdate(selectedRole)}
              disabled={loading || selectedRole === user.role}
            >
              {loading ? '更新中...' : '确认更新'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 重置密码对话框 */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>重置用户密码</DialogTitle>
            <DialogDescription>
              为用户 {user.name || user.email} 设置新密码
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="newPassword">新密码</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="请输入新密码（至少6位）"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">确认密码</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="请再次输入新密码"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>
              取消
            </Button>
            <Button 
              onClick={handlePasswordReset}
              disabled={loading || !newPassword || !confirmPassword}
            >
              {loading ? '重置中...' : '确认重置'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除用户确认对话框 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>删除用户</DialogTitle>
            <DialogDescription>
              确定要删除用户 {user.name || user.email} 吗？此操作不可撤销。
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              取消
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? '删除中...' : '确认删除'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 