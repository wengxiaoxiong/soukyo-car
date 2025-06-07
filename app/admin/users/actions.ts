'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import bcrypt from 'bcryptjs'

// 验证管理员权限
async function checkAdminPermission() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error('未登录')
  }
  
  if (!session.user.role || (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.MANAGER)) {
    throw new Error('权限不足')
  }
  
  return session
}

// 更新用户角色
export async function updateUserRole(userId: string, newRole: UserRole) {
  try {
    const session = await checkAdminPermission()
    
    // 只有ADMIN可以设置ADMIN角色
    if (newRole === UserRole.ADMIN && session.user.role !== UserRole.ADMIN) {
      throw new Error('只有管理员可以设置管理员角色')
    }
    
    // 不能修改自己的角色
    if (userId === session.user.id) {
      throw new Error('不能修改自己的角色')
    }
    
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole }
    })
    
    revalidatePath('/admin/users')
    return { success: true, message: '用户角色更新成功' }
  } catch (error) {
    console.error('更新用户角色失败:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : '更新用户角色失败' 
    }
  }
}

// 切换用户激活状态
export async function toggleUserStatus(userId: string) {
  try {
    const session = await checkAdminPermission()
    
    // 不能停用自己
    if (userId === session.user.id) {
      throw new Error('不能停用自己的账户')
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isActive: true }
    })
    
    if (!user) {
      throw new Error('用户不存在')
    }
    
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive }
    })
    
    revalidatePath('/admin/users')
    return { 
      success: true, 
      message: user.isActive ? '用户已停用' : '用户已激活' 
    }
  } catch (error) {
    console.error('切换用户状态失败:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : '切换用户状态失败' 
    }
  }
}

// 删除用户
export async function deleteUser(userId: string) {
  try {
    const session = await checkAdminPermission()
    
    // 只有ADMIN可以删除用户
    if (session.user.role !== UserRole.ADMIN) {
      throw new Error('只有管理员可以删除用户')
    }
    
    // 不能删除自己
    if (userId === session.user.id) {
      throw new Error('不能删除自己的账户')
    }
    
    // 检查用户是否有关联的订单
    const orderCount = await prisma.order.count({
      where: { userId }
    })
    
    if (orderCount > 0) {
      throw new Error('该用户有关联的订单，无法删除。建议停用用户账户。')
    }
    
    await prisma.user.delete({
      where: { id: userId }
    })
    
    revalidatePath('/admin/users')
    return { success: true, message: '用户删除成功' }
  } catch (error) {
    console.error('删除用户失败:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : '删除用户失败' 
    }
  }
}

// 创建新用户
export async function createUser(data: {
  name: string
  email: string
  password: string
  role: UserRole
  phone?: string
}) {
  try {
    await checkAdminPermission()
    
    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    })
    
    if (existingUser) {
      throw new Error('该邮箱已被注册')
    }
    
    // 加密密码
    const hashedPassword = await bcrypt.hash(data.password, 12)
    
    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        phone: data.phone || null,
        isActive: true
      }
    })
    
    revalidatePath('/admin/users')
    return { success: true, message: '用户创建成功' }
  } catch (error) {
    console.error('创建用户失败:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : '创建用户失败' 
    }
  }
}

// 重置用户密码
export async function resetUserPassword(userId: string, newPassword: string) {
  try {
    await checkAdminPermission()
    
    // 加密新密码
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    })
    
    revalidatePath('/admin/users')
    return { success: true, message: '密码重置成功' }
  } catch (error) {
    console.error('重置密码失败:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : '重置密码失败' 
    }
  }
} 