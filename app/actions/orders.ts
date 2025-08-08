'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { UserRole, OrderStatus } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { emailService } from '@/lib/email/emailService'

// 订单筛选参数类型
export interface OrderFilters {
  page?: number
  pageSize?: number
  status?: OrderStatus | 'ALL'
  startDate?: string
  endDate?: string
  search?: string // 搜索订单号或用户信息
}

// 获取管理员订单列表（带筛选和分页）
export async function getAdminOrders(filters: OrderFilters = {}) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return {
        success: false,
        error: '请先登录'
      }
    }

    // 检查管理员权限
    const allowedRoles: UserRole[] = [UserRole.ADMIN, UserRole.MANAGER]
    if (!session.user.role || !allowedRoles.includes(session.user.role)) {
      return {
        success: false,
        error: '无权限访问'
      }
    }

    const {
      page = 1,
      pageSize = 20,
      status,
      startDate,
      endDate,
      search
    } = filters

    // 构建查询条件
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {}

    // 状态筛选
    if (status && status !== 'ALL') {
      where.status = status
    }

    // 日期范围筛选
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) {
        where.createdAt.gte = new Date(startDate)
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate)
      }
    }

    // 搜索条件（订单号或用户信息）
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { vehicle: { name: { contains: search, mode: 'insensitive' } } },
        { package: { name: { contains: search, mode: 'insensitive' } } }
      ]
    }

    // 计算偏移量
    const offset = (page - 1) * pageSize

    // 并行查询订单数据和总数
    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          },
          vehicle: {
            select: {
              id: true,
              name: true,
              brand: true,
              model: true,
              plateNumber: true
            }
          },
          package: {
            select: {
              id: true,
              name: true,
              description: true,
              price: true
            }
          },
          store: {
            select: {
              id: true,
              name: true,
              address: true
            }
          },
          payments: {
            select: {
              id: true,
              amount: true,
              status: true,
              createdAt: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: pageSize
      }),
      prisma.order.count({ where })
    ])

    // 计算分页信息
    const totalPages = Math.ceil(totalCount / pageSize)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return {
      success: true,
      data: {
        orders,
        pagination: {
          page,
          pageSize,
          totalCount,
          totalPages,
          hasNextPage,
          hasPrevPage
        }
      }
    }
  } catch (error) {
    console.error('获取订单列表失败:', error)
    return {
      success: false,
      error: '获取订单列表失败'
    }
  }
}

// 更新订单状态
export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return {
        success: false,
        error: '请先登录'
      }
    }

    // 检查管理员权限
    const allowedRoles: UserRole[] = [UserRole.ADMIN, UserRole.MANAGER]
    if (!session.user.role || !allowedRoles.includes(session.user.role)) {
      return {
        success: false,
        error: '无权限操作'
      }
    }

    // 检查订单是否存在
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { 
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            preferredLanguage: true
          }
        },
        vehicle: true,
        package: true,
        store: true
      }
    })

    if (!order) {
      return {
        success: false,
        error: '订单不存在'
      }
    }

    // 更新订单状态
    await prisma.order.update({
      where: { id: orderId },
      data: { status }
    })

    // 创建通知给用户
    // const statusMessages = {
    //   PENDING: '订单待处理',
    //   CONFIRMED: '订单已确认',
    //   ONGOING: '订单进行中',
    //   COMPLETED: '订单已完成',
    //   CANCELLED: '订单已取消',
    //   REFUNDED: '订单已退款'
    // }

    // 创建通知
    const vehicleName = order.vehicle?.name || order.package?.name || '未指定'
    const user = await prisma.user.findUnique({ where: { id: order.userId }, select: { preferredLanguage: true } })
    const lang = (user?.preferredLanguage ?? 'en') as 'en' | 'ja' | 'zh'
    const { formatDateParts, buildOrderNotification } = await import('@/lib/utils/notification-i18n')
    const { dateText, timeText } = formatDateParts(order.startDate, lang)
    const built = buildOrderNotification(lang, 'status_updated', {
      orderNumber: order.orderNumber,
      vehicleName,
      storeName: order.store.name,
      dateText,
      timeText,
      status,
    })
    
    await prisma.notification.create({
      data: {
        userId: order.userId,
        title: built.title,
        message: built.message,
        type: 'ORDER',
        relatedOrderId: order.id,
        link: `/orders/${order.id}`
      }
    })

    // 发送邮件通知（管理员操作）
    try {
      await emailService.sendOrderStatusEmail({
        to: order.user.email,
        userName: order.user.name || '用户',
        orderNumber: order.orderNumber,
        status: status,
        vehicleName: order.vehicle?.name,
        packageName: order.package?.name,
        startDate: order.startDate,
        endDate: order.endDate,
        storeName: order.store.name,
        orderId: order.id,
        isUserCancelled: false, // 管理员操作，不是用户主动取消
        language: order.user.preferredLanguage || 'en'
      })
    } catch (emailError) {
      console.error('邮件发送失败:', emailError)
      // 邮件发送失败不影响订单状态更新
    }

    revalidatePath('/admin/orders')
    
    return {
      success: true
    }
  } catch (error) {
    console.error('更新订单状态失败:', error)
    return {
      success: false,
      error: '更新订单状态失败'
    }
  }
}

// 获取订单统计信息
export async function getOrderStats() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return {
        success: false,
        error: '请先登录'
      }
    }

    // 检查管理员权限
    const allowedRoles: UserRole[] = [UserRole.ADMIN, UserRole.MANAGER]
    if (!session.user.role || !allowedRoles.includes(session.user.role)) {
      return {
        success: false,
        error: '无权限访问'
      }
    }

    // 获取各状态的订单统计
    const [
      totalOrders,
      pendingOrders,
      confirmedOrders,
      ongoingOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({ where: { status: 'CONFIRMED' } }),
      prisma.order.count({ where: { status: 'ONGOING' } }),
      prisma.order.count({ where: { status: 'COMPLETED' } }),
      prisma.order.count({ where: { status: 'CANCELLED' } }),
      prisma.order.aggregate({
        where: { status: { in: ['CONFIRMED', 'ONGOING', 'COMPLETED'] } },
        _sum: { totalAmount: true }
      })
    ])

    return {
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        confirmedOrders,
        ongoingOrders,
        completedOrders,
        cancelledOrders,
        totalRevenue: totalRevenue._sum.totalAmount || 0
      }
    }
  } catch (error) {
    console.error('获取订单统计失败:', error)
    return {
      success: false,
      error: '获取订单统计失败'
    }
  }
}

// 获取订单详情（管理员版本）
export async function getAdminOrderDetails(orderId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return {
        success: false,
        error: '请先登录'
      }
    }

    // 检查管理员权限
    const allowedRoles: UserRole[] = [UserRole.ADMIN, UserRole.MANAGER]
    if (!session.user.role || !allowedRoles.includes(session.user.role)) {
      return {
        success: false,
        error: '无权限访问'
      }
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        vehicle: {
          include: {
            store: true
          }
        },
        package: true,
        store: true,
        payments: true
      }
    })

    if (!order) {
      return {
        success: false,
        error: '订单不存在'
      }
    }

    return {
      success: true,
      order
    }
  } catch (error) {
    console.error('获取订单详情失败:', error)
    return {
      success: false,
      error: '获取订单详情失败'
    }
  }
} 