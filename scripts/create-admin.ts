import { PrismaClient } from '@/lib/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    const email = 'admin@soukyo.com'
    const password = 'admin123'
    const name = '系统管理员'

    // 检查管理员是否已存在
    const existingAdmin = await prisma.user.findUnique({
      where: { email }
    })

    if (existingAdmin) {
      console.log('管理员用户已存在')
      return
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10)

    // 创建管理员用户
    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'ADMIN',
        isActive: true,
      }
    })

    console.log('管理员用户创建成功:')
    console.log(`邮箱: ${admin.email}`)
    console.log(`密码: ${password}`)
    console.log(`角色: ${admin.role}`)
  } catch (error) {
    console.error('创建管理员用户失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin() 