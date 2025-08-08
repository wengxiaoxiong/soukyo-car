import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { emailService } from '@/lib/email/emailService'

export async function POST(req: NextRequest) {
  try {
    const { action } = await req.json()

    switch (action) {
      case 'process_payment_reminders':
        return await processPaymentReminders()
      case 'get_stats':
        return await getQueueStats()
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Email queue API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// 处理未付款订单提醒
async function processPaymentReminders() {
  try {
    // 查找超过10分钟未付款的PENDING订单
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000)
    
    const unpaidOrders = await prisma.order.findMany({
      where: {
        status: 'PENDING',
        createdAt: {
          lt: tenMinutesAgo
        },
        payments: {
          some: {
            status: 'PENDING'
          }
        }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            preferredLanguage: true
          }
        },
        vehicle: {
          select: {
            id: true,
            name: true,
            brand: true,
            model: true
          }
        },
        package: {
          select: {
            id: true,
            name: true
          }
        },
        store: {
          select: {
            id: true,
            name: true
          }
        },
        payments: {
          where: {
            status: 'PENDING'
          },
          select: {
            id: true,
            amount: true
          }
        }
      }
    })

    console.log(`找到 ${unpaidOrders.length} 个未付款订单需要发送提醒`)

    const results = []
    for (const order of unpaidOrders) {
      try {
        // 检查是否已经发送过提醒邮件（避免重复发送）
        const existingReminder = await prisma.notification.findFirst({
          where: {
            userId: order.userId,
            relatedOrderId: order.id,
            title: {
              contains: '付款提醒'
            },
            createdAt: {
              gte: new Date(Date.now() - 60 * 60 * 1000) // 1小时内
            }
          }
        })

        if (existingReminder) {
          console.log(`订单 ${order.id} 已发送过提醒邮件，跳过`)
          continue
        }

        // 发送付款提醒邮件
        const vehicleName = order.package?.name || order.vehicle?.name || '未指定'
        // const totalAmount = order.payments.reduce((sum, payment) => sum + payment.amount, 0)
        
        await emailService.sendPaymentReminderEmail({
          to: order.user.email,
          userName: order.user.name || '用户',
          orderNumber: order.orderNumber,
          status: 'PAYMENT_REMINDER',
          vehicleName,
          startDate: order.startDate,
          endDate: order.endDate,
          storeName: order.store.name,
          orderId: order.id,
          language: order.user.preferredLanguage || 'en'
        })

        // 创建通知记录
        await prisma.notification.create({
          data: {
            userId: order.userId,
            title: '付款提醒',
            message: `您的订单 ${order.orderNumber} 尚未完成付款，请在30分钟内完成付款。`,
            type: 'ORDER',
            relatedOrderId: order.id,
            link: `/orders/${order.id}`
          }
        })

        results.push({
          orderId: order.id,
          success: true
        })

        console.log(`已发送付款提醒邮件给订单 ${order.id}`)
      } catch (error) {
        console.error(`发送付款提醒邮件失败，订单 ${order.id}:`, error)
        results.push({
          orderId: order.id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      results
    })
  } catch (error) {
    console.error('处理付款提醒失败:', error)
    return NextResponse.json({ error: '处理付款提醒失败' }, { status: 500 })
  }
}

// 获取队列统计信息
async function getQueueStats() {
  try {
    const { getQueueStats } = await import('@/lib/email/emailQueue')
    const stats = getQueueStats()
    
    return NextResponse.json({
      success: true,
      stats
    })
  } catch (error) {
    console.error('获取队列统计失败:', error)
    return NextResponse.json({ error: '获取队列统计失败' }, { status: 500 })
  }
}
