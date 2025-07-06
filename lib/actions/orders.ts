'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { updatePackageStock } from './packages'
import { createOrderNotification } from './notifications'
import { OrderStatus } from '@prisma/client'

// 创建订单的Schema
const CreateOrderSchema = z.object({
  packageId: z.string().min(1, '套餐ID不能为空'),
  quantity: z.number().min(1, '数量必须大于0').default(1),
  deliveryAddress: z.string().min(1, '收货地址不能为空'),
  deliveryPhone: z.string().min(1, '收货电话不能为空'),
  deliveryName: z.string().min(1, '收货人姓名不能为空'),
  deliveryNotes: z.string().optional(),
  notes: z.string().optional(),
})

// 订单数据类型
export interface OrderData {
  id: string
  orderNumber: string
  packageId: string
  package: {
    id: string
    name: string
    title?: string | null
    price: number
    thumbnail?: string | null
    images: string[]
  }
  quantity: number
  unitPrice: number
  subtotal: number
  taxAmount: number
  totalAmount: number
  status: OrderStatus
  deliveryAddress?: string | null
  deliveryPhone?: string | null
  deliveryName?: string | null
  deliveryNotes?: string | null
  notes?: string | null
  createdAt: Date
  updatedAt: Date
}

// 创建订单
export async function createOrder(formData: FormData) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return { success: false, error: '请先登录' }
  }

  try {
    const data = {
      packageId: formData.get('packageId') as string,
      quantity: parseInt(formData.get('quantity') as string) || 1,
      deliveryAddress: formData.get('deliveryAddress') as string,
      deliveryPhone: formData.get('deliveryPhone') as string,
      deliveryName: formData.get('deliveryName') as string,
      deliveryNotes: formData.get('deliveryNotes') as string || undefined,
      notes: formData.get('notes') as string || undefined,
    }

    const validatedData = CreateOrderSchema.parse(data)

    // 获取套餐信息
    const package_ = await prisma.package.findUnique({
      where: { id: validatedData.packageId },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        isActive: true,
        isPublished: true
      }
    })

    if (!package_) {
      return { success: false, error: '套餐不存在' }
    }

    if (!package_.isActive || !package_.isPublished) {
      return { success: false, error: '套餐不可购买' }
    }

    if (package_.stock < validatedData.quantity) {
      return { success: false, error: '库存不足' }
    }

    // 计算价格
    const unitPrice = package_.price
    const subtotal = unitPrice * validatedData.quantity
    const taxAmount = subtotal * 0.1 // 10%税率
    const totalAmount = subtotal + taxAmount

    // 获取默认店面（简化处理）
    const defaultStore = await prisma.store.findFirst({
      where: { isActive: true },
      select: { id: true }
    })

    if (!defaultStore) {
      return { success: false, error: '系统配置错误，请联系管理员' }
    }

    // 创建订单
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        packageId: validatedData.packageId,
        storeId: defaultStore.id,
        quantity: validatedData.quantity,
        unitPrice,
        subtotal,
        taxAmount,
        totalAmount,
        status: OrderStatus.PENDING,
        deliveryAddress: validatedData.deliveryAddress,
        deliveryPhone: validatedData.deliveryPhone,
        deliveryName: validatedData.deliveryName,
        deliveryNotes: validatedData.deliveryNotes,
        notes: validatedData.notes,
      },
      include: {
        package: {
          select: {
            id: true,
            name: true,
            title: true,
            price: true,
            thumbnail: true,
            images: true
          }
        }
      }
    })

    // 减少库存
    await updatePackageStock(validatedData.packageId, validatedData.quantity)

    // 创建通知
    await createOrderNotification(order.id, session.user.id)

    revalidatePath('/orders')
    return { success: true, order }
  } catch (error) {
    console.error('创建订单失败:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: '创建订单失败' }
  }
}

// 获取用户订单列表
export async function getUserOrders() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return { success: false, error: '请先登录' }
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        package: {
          select: {
            id: true,
            name: true,
            title: true,
            price: true,
            thumbnail: true,
            images: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return { success: true, orders }
  } catch (error) {
    console.error('获取用户订单失败:', error)
    return { success: false, error: '获取订单列表失败' }
  }
}

// 根据ID获取订单详情
export async function getOrderById(orderId: string) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return { success: false, error: '请先登录' }
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        package: {
          select: {
            id: true,
            name: true,
            title: true,
            price: true,
            thumbnail: true,
            images: true,
            description: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        store: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true
          }
        }
      }
    })

    if (!order) {
      return { success: false, error: '订单不存在' }
    }

    // 检查权限
    if (order.userId !== session.user.id) {
      // 检查是否是管理员
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true }
      })

      if (user?.role !== 'ADMIN') {
        return { success: false, error: '权限不足' }
      }
    }

    return { success: true, order }
  } catch (error) {
    console.error('获取订单详情失败:', error)
    return { success: false, error: '获取订单详情失败' }
  }
}

// 取消订单
export async function cancelOrder(orderId: string) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return { success: false, error: '请先登录' }
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        userId: true,
        status: true,
        packageId: true,
        quantity: true
      }
    })

    if (!order) {
      return { success: false, error: '订单不存在' }
    }

    // 检查权限
    if (order.userId !== session.user.id) {
      return { success: false, error: '权限不足' }
    }

    // 检查订单状态
    if (order.status !== OrderStatus.PENDING) {
      return { success: false, error: '订单状态不允许取消' }
    }

    // 更新订单状态
    await prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.CANCELLED }
    })

    // 恢复库存
    await prisma.package.update({
      where: { id: order.packageId },
      data: { 
        stock: { increment: order.quantity } 
      }
    })

    revalidatePath('/orders')
    return { success: true }
  } catch (error) {
    console.error('取消订单失败:', error)
    return { success: false, error: '取消订单失败' }
  }
}

// 确认订单（管理员用）
export async function confirmOrder(orderId: string) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return { success: false, error: '请先登录' }
  }

  // 检查管理员权限
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  })

  if (user?.role !== 'ADMIN') {
    return { success: false, error: '权限不足' }
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        status: true,
        userId: true
      }
    })

    if (!order) {
      return { success: false, error: '订单不存在' }
    }

    if (order.status !== OrderStatus.PENDING) {
      return { success: false, error: '订单状态不允许确认' }
    }

    // 更新订单状态
    await prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.CONFIRMED }
    })

    // 发送确认通知
    await prisma.notification.create({
      data: {
        userId: order.userId,
        title: '订单已确认',
        message: '您的订单已被确认，我们将尽快安排发货。',
        type: 'ORDER',
        relatedOrderId: orderId
      }
    })

    revalidatePath('/admin/orders')
    return { success: true }
  } catch (error) {
    console.error('确认订单失败:', error)
    return { success: false, error: '确认订单失败' }
  }
}

// 获取所有订单列表（管理员用）
export async function getAllOrders(page: number = 1, pageSize: number = 20) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return { success: false, error: '请先登录' }
  }

  // 检查管理员权限
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  })

  if (user?.role !== 'ADMIN') {
    return { success: false, error: '权限不足' }
  }

  try {
    const offset = (page - 1) * pageSize

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        skip: offset,
        take: pageSize,
        include: {
          package: {
            select: {
              id: true,
              name: true,
              title: true,
              price: true,
              thumbnail: true
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.order.count()
    ])

    return {
      success: true,
      orders,
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: page
    }
  } catch (error) {
    console.error('获取订单列表失败:', error)
    return { success: false, error: '获取订单列表失败' }
  }
}