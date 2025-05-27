import { prisma } from './prisma'

// 模拟获取当前用户的函数
export async function getCurrentUser() {
  // 这里应该根据实际的认证方式来获取用户
  // 比如从session、JWT token等获取用户ID
  // 暂时返回一个管理员用户用于测试
  try {
    const user = await prisma.user.findFirst({
      where: {
        role: 'ADMIN'
      }
    })
    return user
  } catch (error) {
    console.error('获取用户失败:', error)
    return null
  }
}

// 检查用户是否有管理员权限
export async function isAdmin() {
  // 在开发环境中，如果数据库连接失败，允许访问
  if (process.env.NODE_ENV === 'development') {
    try {
      const user = await getCurrentUser()
      return user?.role === 'ADMIN' || user?.role === 'MANAGER'
    } catch (error) {
      console.warn('数据库连接失败，开发环境允许访问管理后台:', error)
      return true
    }
  }
  
  const user = await getCurrentUser()
  return user?.role === 'ADMIN' || user?.role === 'MANAGER'
} 