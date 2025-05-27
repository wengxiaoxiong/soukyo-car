import { prisma } from '../lib/prisma'

async function createAdmin() {
  try {
    // 检查是否已经存在管理员用户
    const existingAdmin = await prisma.user.findFirst({
      where: {
        role: 'ADMIN'
      }
    })

    if (existingAdmin) {
      console.log('管理员用户已存在:', existingAdmin.email)
      return
    }

    // 创建管理员用户
    const admin = await prisma.user.create({
      data: {
        email: 'admin@soukuo.com',
        name: '系统管理员',
        role: 'ADMIN',
        isActive: true,
      }
    })

    console.log('管理员用户创建成功:', admin.email)
  } catch (error) {
    console.error('创建管理员用户失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin() 