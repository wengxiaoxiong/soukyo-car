'use server'

import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { NotificationType } from '@prisma/client'

// 创建订单通知
export async function createOrderNotification(orderId: string, userId: string) {
  try {
    // 获取订单信息
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        package: {
          select: {
            name: true,
            title: true
          }
        }
      }
    })

    if (!order) {
      throw new Error('订单不存在')
    }

    // 创建用户通知
    await prisma.notification.create({
      data: {
        userId,
        title: '订单已创建',
        message: `您的订单 ${order.orderNumber} 已成功创建，包含套餐：${order.package.name}`,
        type: NotificationType.ORDER,
        relatedOrderId: orderId
      }
    })

    // 创建管理员通知
    const adminUsers = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true }
    })

    const adminNotifications = adminUsers.map(admin => ({
      userId: admin.id,
      title: '新订单通知',
      message: `用户创建了新订单 ${order.orderNumber}，套餐：${order.package.name}`,
      type: NotificationType.ORDER,
      relatedOrderId: orderId
    }))

    if (adminNotifications.length > 0) {
      await prisma.notification.createMany({
        data: adminNotifications
      })
    }

    return { success: true }
  } catch (error) {
    console.error('创建订单通知失败:', error)
    throw new Error('创建订单通知失败')
  }
}

// 获取用户通知列表
export async function getUserNotifications(page: number = 1, pageSize: number = 20) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return { success: false, error: '请先登录' }
  }

  try {
    const offset = (page - 1) * pageSize

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: {
          userId: session.user.id
        },
        skip: offset,
        take: pageSize,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          relatedOrder: {
            select: {
              id: true,
              orderNumber: true,
              package: {
                select: {
                  name: true,
                  title: true
                }
              }
            }
          }
        }
      }),
      prisma.notification.count({
        where: {
          userId: session.user.id
        }
      }),
      prisma.notification.count({
        where: {
          userId: session.user.id,
          isRead: false
        }
      })
    ])

    return {
      success: true,
      notifications,
      total,
      unreadCount,
      totalPages: Math.ceil(total / pageSize),
      currentPage: page
    }
  } catch (error) {
    console.error('获取用户通知失败:', error)
    return { success: false, error: '获取通知列表失败' }
  }
}

// 标记通知为已读
export async function markNotificationAsRead(notificationId: string) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return { success: false, error: '请先登录' }
  }

  try {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
      select: { userId: true }
    })

    if (!notification) {
      return { success: false, error: '通知不存在' }
    }

    if (notification.userId !== session.user.id) {
      return { success: false, error: '权限不足' }
    }

    await prisma.notification.update({
      where: { id: notificationId },
      data: { 
        isRead: true,
        readAt: new Date()
      }
    })

    return { success: true }
  } catch (error) {
    console.error('标记通知为已读失败:', error)
    return { success: false, error: '标记通知为已读失败' }
  }
}

// 标记所有通知为已读
export async function markAllNotificationsAsRead() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return { success: false, error: '请先登录' }
  }

  try {
    await prisma.notification.updateMany({
      where: {
        userId: session.user.id,
        isRead: false
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    })

    return { success: true }
  } catch (error) {
    console.error('标记所有通知为已读失败:', error)
    return { success: false, error: '标记所有通知为已读失败' }
  }
}

// 删除通知
export async function deleteNotification(notificationId: string) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return { success: false, error: '请先登录' }
  }

  try {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
      select: { userId: true }
    })

    if (!notification) {
      return { success: false, error: '通知不存在' }
    }

    if (notification.userId !== session.user.id) {
      return { success: false, error: '权限不足' }
    }

    await prisma.notification.delete({
      where: { id: notificationId }
    })

    return { success: true }
  } catch (error) {
    console.error('删除通知失败:', error)
    return { success: false, error: '删除通知失败' }
  }
}

// 获取未读通知数量
export async function getUnreadNotificationCount() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return { success: false, error: '请先登录' }
  }

  try {
    const count = await prisma.notification.count({
      where: {
        userId: session.user.id,
        isRead: false
      }
    })

    return { success: true, count }
  } catch (error) {
    console.error('获取未读通知数量失败:', error)
    return { success: false, error: '获取未读通知数量失败' }
  }
}

// 创建系统通知（管理员用）
export async function createSystemNotification(
  title: string,
  message: string,
  userIds?: string[]
) {
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
    let targetUsers: string[]

    if (userIds && userIds.length > 0) {
      // 发送给指定用户
      targetUsers = userIds
    } else {
      // 发送给所有用户
      const allUsers = await prisma.user.findMany({
        where: { isActive: true },
        select: { id: true }
      })
      targetUsers = allUsers.map(u => u.id)
    }

    const notifications = targetUsers.map(userId => ({
      userId,
      title,
      message,
      type: NotificationType.SYSTEM
    }))

    await prisma.notification.createMany({
      data: notifications
    })

    return { success: true }
  } catch (error) {
    console.error('创建系统通知失败:', error)
    return { success: false, error: '创建系统通知失败' }
  }
}