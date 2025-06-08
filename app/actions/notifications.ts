'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { NotificationType } from '@prisma/client'

export interface NotificationData {
  id: string
  title: string
  message: string
  type: NotificationType
  isRead: boolean
  readAt: Date | null
  relatedOrderId: string | null
  createdAt: Date
}

// 获取用户通知列表
export async function getUserNotifications(limit: number = 10, offset: number = 0) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return {
        success: false,
        error: '用户未登录'
      }
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset,
      include: {
        relatedOrder: {
          select: {
            orderNumber: true,
            vehicle: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    // 获取未读数量
    const unreadCount = await prisma.notification.count({
      where: {
        userId: session.user.id,
        isRead: false
      }
    })

    return {
      success: true,
      data: {
        notifications,
        unreadCount
      }
    }
  } catch (error) {
    console.error('获取通知失败:', error)
    return {
      success: false,
      error: '获取通知失败'
    }
  }
}

// 标记通知为已读
export async function markNotificationAsRead(notificationId: string) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return {
        success: false,
        error: '用户未登录'
      }
    }

    // 验证通知归属于当前用户
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId: session.user.id
      }
    })

    if (!notification) {
      return {
        success: false,
        error: '通知不存在'
      }
    }

    await prisma.notification.update({
      where: {
        id: notificationId
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    })

    return {
      success: true
    }
  } catch (error) {
    console.error('标记已读失败:', error)
    return {
      success: false,
      error: '标记已读失败'
    }
  }
}

// 标记所有通知为已读
export async function markAllNotificationsAsRead() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return {
        success: false,
        error: '用户未登录'
      }
    }

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

    return {
      success: true
    }
  } catch (error) {
    console.error('标记全部已读失败:', error)
    return {
      success: false,
      error: '标记全部已读失败'
    }
  }
}

// 创建新通知（系统内部使用）
export async function createNotification({
  userId,
  title,
  message,
  type,
  relatedOrderId
}: {
  userId: string
  title: string
  message: string
  type: NotificationType
  relatedOrderId?: string
}) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        relatedOrderId
      }
    })

    return {
      success: true,
      data: notification
    }
  } catch (error) {
    console.error('创建通知失败:', error)
    return {
      success: false,
      error: '创建通知失败'
    }
  }
} 