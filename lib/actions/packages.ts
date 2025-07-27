'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Stripe from 'stripe'

// 初始化Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

export interface Package {
  id: string
  name: string
  description: string | null
  content: string | null
  images: string[]
  price: number
  stock: number
  isActive: boolean
  isFeatured: boolean
  createdAt: Date
  updatedAt: Date
}

// 获取所有套餐（管理端使用）
export async function getPackages(): Promise<Package[]> {
  try {
    const packages = await prisma.package.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return packages
  } catch (error) {
    console.error('获取套餐列表失败:', error)
    return []
  }
}

// 获取推荐套餐
export async function getFeaturedPackages(): Promise<Package[]> {
  try {
    const packages = await prisma.package.findMany({
      where: {
        isActive: true,
        isFeatured: true,
        stock: {
          gt: 0
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 8
    })
    
    return packages
  } catch (error) {
    console.error('获取推荐套餐失败:', error)
    return []
  }
}

// 获取所有套餐
export async function getAllPackages(params?: {
  minPrice?: number
  maxPrice?: number
  search?: string
}): Promise<Package[]> {
  try {
    const where: {
      isActive: boolean
      stock: { gt: number }
      price?: { gte?: number; lte?: number }
      OR?: Array<{ name: { contains: string; mode: 'insensitive' } } | { description: { contains: string; mode: 'insensitive' } }>
    } = {
      isActive: true,
      stock: {
        gt: 0
      }
    }

    if (params?.minPrice !== undefined) {
      where.price = { ...where.price, gte: params.minPrice }
    }

    if (params?.maxPrice !== undefined) {
      where.price = { ...where.price, lte: params.maxPrice }
    }

    if (params?.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } }
      ]
    }

    const packages = await prisma.package.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return packages
  } catch (error) {
    console.error('获取套餐列表失败:', error)
    return []
  }
}

// 获取单个套餐详情
export async function getPackageById(id: string): Promise<Package | null> {
  try {
    const packageData = await prisma.package.findUnique({
      where: { id }
    })
    
    return packageData
  } catch (error) {
    console.error('获取套餐详情失败:', error)
    return null
  }
}

// 创建套餐
export async function createPackage(formData: FormData) {
  try {
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const content = formData.get('content') as string
    const price = parseFloat(formData.get('price') as string)
    const stock = parseInt(formData.get('stock') as string)
    const isFeatured = formData.get('isFeatured') === 'on'
    const images = formData.getAll('images') as string[]

    await prisma.package.create({
      data: {
        name,
        description,
        content,
        price,
        stock,
        isFeatured,
        images: images.filter(img => img.trim() !== '')
      }
    })

    revalidatePath('/admin/packages')
    revalidatePath('/')
  } catch (error) {
    console.error('创建套餐失败:', error)
    throw new Error('创建套餐失败')
  }
  
  redirect('/admin/packages')
}

// 更新套餐
export async function updatePackage(id: string, formData: FormData) {
  try {
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const content = formData.get('content') as string
    const price = parseFloat(formData.get('price') as string)
    const stock = parseInt(formData.get('stock') as string)
    const isFeatured = formData.get('isFeatured') === 'on'
    const images = formData.getAll('images') as string[]

    await prisma.package.update({
      where: { id },
      data: {
        name,
        description,
        content,
        price,
        stock,
        isFeatured,
        images: images.filter(img => img.trim() !== '')
      }
    })

    revalidatePath('/admin/packages')
    revalidatePath('/')
  } catch (error) {
    console.error('更新套餐失败:', error)
    throw new Error('更新套餐失败')
  }
}

// 删除套餐
export async function deletePackage(id: string) {
  try {
    await prisma.package.delete({
      where: { id }
    })

    revalidatePath('/admin/packages')
    revalidatePath('/')
  } catch (error) {
    console.error('删除套餐失败:', error)
    throw new Error('删除套餐失败')
  }
}

// 切换套餐状态
export async function togglePackageStatus(id: string) {
  try {
    const packageData = await prisma.package.findUnique({
      where: { id },
      select: { isActive: true }
    })

    if (!packageData) {
      throw new Error('套餐不存在')
    }

    await prisma.package.update({
      where: { id },
      data: {
        isActive: !packageData.isActive
      }
    })

    revalidatePath('/admin/packages')
    revalidatePath('/')
  } catch (error) {
    console.error('切换套餐状态失败:', error)
    throw new Error('切换套餐状态失败')
  }
}

// 购买套餐（库存减一）
export async function purchasePackage(packageId: string) {
  try {
    const packageData = await prisma.package.findUnique({
      where: { id: packageId },
      select: { stock: true }
    })

    if (!packageData) {
      throw new Error('套餐不存在')
    }

    if (packageData.stock <= 0) {
      throw new Error('库存不足')
    }

    await prisma.package.update({
      where: { id: packageId },
      data: {
        stock: packageData.stock - 1
      }
    })

    revalidatePath('/')
  } catch (error) {
    console.error('购买套餐失败:', error)
    throw new Error('购买套餐失败')
  }
}

// 创建套餐订单和支付
export async function createPackageBooking(packageId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return {
        success: false,
        error: '请先登录'
      }
    }

    // 获取套餐信息
    const packageData = await prisma.package.findUnique({
      where: { id: packageId },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        images: true,
        isActive: true
      }
    })

    if (!packageData) {
      return {
        success: false,
        error: '套餐不存在'
      }
    }

    if (!packageData.isActive) {
      return {
        success: false,
        error: '套餐已下架'
      }
    }

    if (packageData.stock <= 0) {
      return {
        success: false,
        error: '库存不足'
      }
    }

    // 获取第一个可用店面
    const firstStore = await prisma.store.findFirst({
      where: { isActive: true },
      select: { id: true }
    })

    if (!firstStore) {
      return {
        success: false,
        error: '系统暂时不可用，请稍后再试'
      }
    }

    // 计算价格（套餐价格 + 税费）
    const subtotal = packageData.price
    const taxAmount = subtotal * 0.1 // 10% 税费
    const totalAmount = Math.round((subtotal + taxAmount) * 100) // Stripe 需要以分为单位

    // 创建订单（支付状态为PENDING）
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        packageId: packageId,
        storeId: firstStore.id, // 使用第一个可用店面
        startDate: new Date(), // 套餐购买当天生效
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30天有效期
        totalDays: 1, // 套餐购买按单次计算
        pricePerDay: packageData.price,
        subtotal: subtotal,
        taxAmount: taxAmount,
        totalAmount: totalAmount / 100, // 数据库存储以元为单位
        driverLicense: 'N/A', // 套餐不需要驾驶证
        status: 'PENDING'
      },
      include: {
        package: true,
        user: true
      }
    })

    // 创建Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: session.user.email || undefined,
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: `套餐服务 - ${packageData.name}`,
              description: packageData.description || `购买套餐：${packageData.name}`,
              images: packageData.images?.length > 0 ? [packageData.images[0]] : undefined,
            },
            unit_amount: totalAmount
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/payment/cancel?order_id=${order.id}`,
      metadata: {
        orderId: order.id,
        userId: session.user.id,
        packageId: packageId,
      },
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30分钟后过期
    })

    // 更新订单，保存checkout session ID
    await prisma.order.update({
      where: { id: order.id },
      data: { 
        stripePaymentIntentId: checkoutSession.id // 复用这个字段存储session ID
      }
    })

    // 创建支付记录
    await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: totalAmount / 100, // 数据库存储以元为单位
        stripePaymentIntentId: checkoutSession.id,
        status: 'PENDING'
      }
    })

    return {
      success: true,
      order,
      checkoutUrl: checkoutSession.url
    }
  } catch (error) {
    console.error('创建套餐订单失败:', error)
    return {
      success: false,
      error: '创建订单失败'
    }
  }
}