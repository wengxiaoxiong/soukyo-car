'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Stripe from 'stripe'
import { z } from 'zod'
// import { emailService } from '@/lib/email/emailService'

// 初始化Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
})

// 租车预订表单验证模式
const BookingFormSchema = z.object({
  vehicleId: z.string().min(1, '请选择车辆'),
  startDate: z.string().min(1, '请选择开始日期'),
  endDate: z.string().min(1, '请选择结束日期'),
  driverLicense: z.string().min(1, '请填写驾驶证号码'),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  notes: z.string().optional(),
})

export type BookingFormData = z.infer<typeof BookingFormSchema>

// 检查车辆可用性
export async function checkVehicleAvailability(
  vehicleId: string,
  startDate: string,
  endDate: string
) {
  try {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // 将今天的时间设为午夜，以便比较日期

    // 检查日期是否有效
    if (start >= end) {
      return {
        success: false,
        error: '结束日期必须晚于开始日期'
      }
    }

    // 修改日期检查逻辑，允许当天租车
    if (start < today) {
      return {
        success: false,
        error: '开始日期不能早于今天'
      }
    }

    // 检查车辆是否存在且可用
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: { store: true }
    })

    if (!vehicle) {
      return {
        success: false,
        error: '车辆不存在'
      }
    }

    if (!vehicle.isAvailable) {
      return {
        success: false,
        error: '车辆当前不可用'
      }
    }

    // 检查时间段内是否有冲突的订单
    const conflictingOrders = await prisma.order.findMany({
      where: {
        vehicleId: vehicleId,
        status: {
          in: ['PENDING', 'CONFIRMED', 'ONGOING']
        },
        OR: [
          {
            AND: [
              { startDate: { lte: start } },
              { endDate: { gt: start } }
            ]
          },
          {
            AND: [
              { startDate: { lt: end } },
              { endDate: { gte: end } }
            ]
          },
          {
            AND: [
              { startDate: { gte: start } },
              { endDate: { lte: end } }
            ]
          }
        ]
      }
    })

    if (conflictingOrders.length > 0) {
      return {
        success: false,
        error: '该时间段车辆已被预订'
      }
    }

    // 计算租期和价格
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    const subtotal = totalDays * vehicle.pricePerDay
    const taxAmount = subtotal * 0.1 // 10% 税费
    const totalAmount = subtotal + taxAmount

    return {
      success: true,
      vehicle,
      totalDays,
      subtotal,
      taxAmount,
      totalAmount
    }
  } catch (error) {
    console.error('检查车辆可用性失败:', error)
    return {
      success: false,
      error: '检查车辆可用性失败'
    }
  }
}

// 创建租车订单
export async function createBooking(formData: BookingFormData) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return {
        success: false,
        error: '请先登录'
      }
    }

    // 验证表单数据
    const validation = BookingFormSchema.safeParse(formData)
    if (!validation.success) {
      return {
        success: false,
        error: '表单数据无效',
        errors: validation.error.flatten().fieldErrors
      }
    }

    const { vehicleId, startDate, endDate, driverLicense, emergencyContact, emergencyPhone, notes } = validation.data

    // 检查车辆可用性
    const availability = await checkVehicleAvailability(vehicleId, startDate, endDate)
    if (!availability.success) {
      return availability
    }

    const { vehicle, totalDays, subtotal, taxAmount, totalAmount } = availability

    if (!vehicle || !totalDays || !subtotal || !taxAmount || !totalAmount) {
      return {
        success: false,
        error: '价格计算错误'
      }
    }

    // 创建订单（支付状态为PENDING）
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        vehicleId: vehicleId,
        storeId: vehicle.storeId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalDays: totalDays,
        pricePerDay: vehicle.pricePerDay,
        subtotal: subtotal,
        taxAmount: taxAmount,
        totalAmount: totalAmount,
        driverLicense,
        emergencyContact,
        emergencyPhone,
        notes,
        status: 'PENDING'
      },
      include: {
        vehicle: true,
        store: true,
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
              name: `租车服务 - ${vehicle.brand} ${vehicle.model}`,
              description: `租期：${startDate} 至 ${endDate}（${totalDays}天）`,
              images: vehicle.images?.length > 0 ? [vehicle.images[0]] : undefined,
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
        vehicleId: vehicleId,
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
        amount: totalAmount,
        stripePaymentIntentId: checkoutSession.id,
        status: 'PENDING'
      }
    })

    // 注意：订单创建时不发送邮件，等待支付完成后发送确认邮件

    return {
      success: true,
      order,
      checkoutUrl: checkoutSession.url
    }
  } catch (error) {
    console.error('创建订单失败:', error)
    return {
      success: false,
      error: '创建订单失败'
    }
  }
}

// 确认支付成功
export async function confirmPayment(paymentIntentId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return {
        success: false,
        error: '请先登录'
      }
    }

    // 获取PaymentIntent状态
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    
    if (paymentIntent.status !== 'succeeded') {
      return {
        success: false,
        error: '支付尚未完成'
      }
    }

    // 更新订单状态
    const order = await prisma.order.findFirst({
      where: {
        stripePaymentIntentId: paymentIntentId,
        userId: session.user.id
      }
    })

    if (!order) {
      return {
        success: false,
        error: '订单不存在'
      }
    }

    // 更新订单和支付状态
    await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: { status: 'CONFIRMED' }
      }),
      prisma.payment.updateMany({
        where: { 
          orderId: order.id,
          stripePaymentIntentId: paymentIntentId 
        },
        data: { 
          status: 'SUCCESS',
          stripeChargeId: paymentIntent.latest_charge as string
        }
      })
    ])

    // 创建更丰富的通知（包含车型/时间/门店，并可跳转订单详情）
    const orderDetailForNotify = await prisma.order.findUnique({
      where: { id: order.id },
      include: { vehicle: true, package: true, store: true }
    })

    if (orderDetailForNotify) {
      const vehicleName = orderDetailForNotify.package?.name || orderDetailForNotify.vehicle?.name || '未指定'
      const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { preferredLanguage: true } })
      const lang = (user?.preferredLanguage ?? 'en') as 'en' | 'ja' | 'zh'
      const { formatDateParts, buildOrderNotification } = await import('@/lib/utils/notification-i18n')
      const { dateText, timeText } = formatDateParts(orderDetailForNotify.startDate, lang)
      const built = buildOrderNotification(lang, 'order_confirmed', {
        orderNumber: orderDetailForNotify.orderNumber,
        vehicleName,
        storeName: orderDetailForNotify.store?.name ?? undefined,
        dateText,
        timeText,
      })

      await prisma.notification.create({
        data: {
          userId: session.user.id,
          title: built.title,
          message: built.message,
          type: 'ORDER',
          relatedOrderId: orderDetailForNotify.id,
          link: `/orders/${orderDetailForNotify.id}`
        }
      })
    }

    // 发送订单确认邮件
    try {
      const { emailService } = await import('@/lib/email/emailService')
      const user = await prisma.user.findUnique({ 
        where: { id: session.user.id }, 
        select: { email: true, name: true, preferredLanguage: true } 
      })
      
      if (user) {
        const vehicleName = orderDetailForNotify?.package?.name || orderDetailForNotify?.vehicle?.name || '未指定'
        
        await emailService.sendOrderStatusEmail({
          to: user.email,
          userName: user.name || '用户',
          orderNumber: order.orderNumber,
          status: 'CONFIRMED',
          vehicleName,
          startDate: order.startDate,
          endDate: order.endDate,
          storeName: orderDetailForNotify?.store?.name || '门店',
          orderId: order.id,
          userLanguage: user.preferredLanguage as string
        })
        
        console.log('Order confirmation email sent for order:', order.id)
      }
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError)
    }

    revalidatePath('/orders')
    
    return {
      success: true,
      orderId: order.id
    }
  } catch (error) {
    console.error('确认支付失败:', error)
    return {
      success: false,
      error: '确认支付失败'
    }
  }
}

// 获取用户订单列表
export async function getUserOrders() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return {
        success: false,
        error: '请先登录'
      }
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        vehicle: true,
        package: true,
        store: true,
        payments: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return {
      success: true,
      orders
    }
  } catch (error) {
    console.error('获取订单列表失败:', error)
    return {
      success: false,
      error: '获取订单列表失败'
    }
  }
}

// 获取订单详情
export async function getOrderDetails(orderId: string) {
  try {
    // 获取用户会话
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return {
        success: false,
        error: '请先登录'
      }
    }

    // 获取订单详情（包含用户信息）
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: session.user.id
      },
      include: {
        vehicle: {
          include: {
            store: true
          }
        },
        package: true,
        store: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            preferredLanguage: true
          }
        }
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

// 取消订单
export async function cancelOrder(orderId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return {
        success: false,
        error: '请先登录'
      }
    }

    const order = await prisma.order.findFirst({
      where: { 
        id: orderId,
        userId: session.user.id 
      },
      include: {
        vehicle: true,
        package: true,
        store: true,
        user: true
      }
    })

    if (!order) {
      return {
        success: false,
        error: '订单不存在'
      }
    }

    if (order.status !== 'PENDING' && order.status !== 'CONFIRMED') {
      return {
        success: false,
        error: '该订单状态无法取消'
      }
    }

    // 如果有支付意图，尝试取消
    if (order.stripePaymentIntentId) {
      try {
        await stripe.paymentIntents.cancel(order.stripePaymentIntentId)
      } catch (stripeError) {
        console.warn('取消Stripe PaymentIntent失败:', stripeError)
      }
    }

    // 更新订单状态
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' }
    })

    // 创建更丰富的通知（包含车型/时间/门店，并可跳转订单详情）
    const vehicleName2 = order.package?.name || order.vehicle?.name || '未指定'
    const currentUser = await prisma.user.findUnique({ where: { id: session.user.id }, select: { preferredLanguage: true } })
    const lang2 = (currentUser?.preferredLanguage ?? 'en') as 'en' | 'ja' | 'zh'
    const { formatDateParts: format2, buildOrderNotification: build2 } = await import('@/lib/utils/notification-i18n')
    const { dateText: date2, timeText: time2 } = format2(order.startDate, lang2)
    const built2 = build2(lang2, 'order_cancelled', {
      orderNumber: order.orderNumber,
      vehicleName: vehicleName2,
      storeName: order.store.name,
      dateText: date2,
      timeText: time2,
    })
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        title: built2.title,
        message: built2.message,
        type: 'ORDER',
        relatedOrderId: order.id,
        link: `/orders/${order.id}`
      }
    })

    // 发送订单取消邮件（用户主动取消）
    try {
      const { emailService } = await import('@/lib/email/emailService')
      await emailService.sendOrderStatusEmail({
        to: order.user.email,
        userName: order.user.name || '用户',
        orderNumber: order.orderNumber,
        status: 'CANCELLED',
        vehicleName: order.vehicle?.name,
        packageName: order.package?.name,
        startDate: order.startDate,
        endDate: order.endDate,
        storeName: order.store.name,
        orderId: order.id,
        isUserCancelled: true, // 标记为用户主动取消
        userLanguage: order.user.preferredLanguage || 'en'
      })
    } catch (emailError) {
      console.error('邮件发送失败:', emailError)
      // 邮件发送失败不影响订单取消
    }

    revalidatePath('/orders')
    
    return {
      success: true
    }
  } catch (error) {
    console.error('取消订单失败:', error)
    return {
      success: false,
      error: '取消订单失败'
    }
  }
}

// 处理Stripe Checkout成功回调
export async function handleCheckoutSuccess(sessionId: string, orderId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return {
        success: false,
        error: '请先登录'
      }
    }

    // 验证Stripe Checkout Session状态
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId)
    
    if (checkoutSession.payment_status !== 'paid') {
      return {
        success: false,
        error: '支付尚未完成'
      }
    }

    // 验证订单属于当前用户
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: session.user.id
      },
      include: {
        package: {
          select: { id: true, name: true, stock: true }
        }
      }
    })

    if (!order) {
      return {
        success: false,
        error: '订单不存在'
      }
    }

    // 检查是否已经处理过（避免重复处理）
    const existingPayment = await prisma.payment.findFirst({
      where: {
        orderId: order.id,
        status: 'SUCCESS'
      }
    })

    if (existingPayment) {
      // 如果已经处理过，直接返回成功，不重复发送邮件和通知
      return {
        success: true,
        orderId: order.id
      }
    }

    // 更新订单和支付状态
    if (order.package) {
      // 如果是套餐订单，同时扣减库存
      await prisma.$transaction([
        prisma.order.update({
          where: { id: order.id },
          data: { status: 'PENDING' } // 保持PENDING状态，等待商家确认
        }),
        prisma.payment.updateMany({
          where: { 
            orderId: order.id,
            stripePaymentIntentId: sessionId
          },
          data: { 
            status: 'SUCCESS',
            stripeChargeId: checkoutSession.payment_intent as string
          }
        }),
        prisma.package.update({
          where: { id: order.package.id },
          data: { stock: Math.max(0, order.package.stock - 1) }
        })
      ])
    } else {
      // 如果是车辆订单，只更新订单和支付状态
      await prisma.$transaction([
        prisma.order.update({
          where: { id: order.id },
          data: { status: 'PENDING' } // 保持PENDING状态，等待商家确认
        }),
        prisma.payment.updateMany({
          where: { 
            orderId: order.id,
            stripePaymentIntentId: sessionId
          },
          data: { 
            status: 'SUCCESS',
            stripeChargeId: checkoutSession.payment_intent as string
          }
        })
      ])
    }

    // 创建更丰富的通知（包含车型/时间/门店，并可跳转订单详情）
    const orderDetailForNotify2 = await prisma.order.findUnique({
      where: { id: order.id },
      include: { vehicle: true, package: true, store: true }
    })
    if (orderDetailForNotify2) {
      // 检查是否已经创建过通知（避免重复通知）
      const existingNotification = await prisma.notification.findFirst({
        where: {
          userId: session.user.id,
          relatedOrderId: order.id,
          title: {
            contains: '支付成功'
          },
          createdAt: {
            gte: new Date(Date.now() - 60 * 60 * 1000) // 1小时内
          }
        }
      })

      if (!existingNotification) {
        const vehicleName = orderDetailForNotify2.package?.name || orderDetailForNotify2.vehicle?.name || '未指定'
        const me = await prisma.user.findUnique({ where: { id: session.user.id }, select: { preferredLanguage: true } })
        const lang3 = (me?.preferredLanguage ?? 'en') as 'en' | 'ja' | 'zh'
        const { formatDateParts: format3, buildOrderNotification: build3 } = await import('@/lib/utils/notification-i18n')
        const { dateText: d3, timeText: t3 } = format3(orderDetailForNotify2.startDate, lang3)
        const built3 = build3(lang3, 'payment_success', {
          orderNumber: orderDetailForNotify2.orderNumber,
          vehicleName,
          storeName: orderDetailForNotify2.store?.name ?? undefined,
          dateText: d3,
          timeText: t3,
        })
        await prisma.notification.create({
          data: {
            userId: session.user.id,
            title: built3.title,
            message: built3.message,
            type: 'ORDER',
            relatedOrderId: orderDetailForNotify2.id,
            link: `/orders/${orderDetailForNotify2.id}`
          }
        })
      }
    }

    // 发送订单确认邮件
    try {
      const { emailService } = await import('@/lib/email/emailService')
      const user = await prisma.user.findUnique({ 
        where: { id: session.user.id }, 
        select: { email: true, name: true, preferredLanguage: true } 
      })
      
      if (user) {
        // 检查是否已经发送过邮件（避免重复发送）
        const existingEmailNotification = await prisma.notification.findFirst({
          where: {
            userId: session.user.id,
            relatedOrderId: order.id,
            title: {
              contains: '订单已下单'
            },
            createdAt: {
              gte: new Date(Date.now() - 60 * 60 * 1000) // 1小时内
            }
          }
        })

        if (!existingEmailNotification) {
          const vehicleName = orderDetailForNotify2?.package?.name || orderDetailForNotify2?.vehicle?.name || '未指定'
          
          await emailService.sendOrderStatusEmail({
            to: user.email,
            userName: user.name || '用户',
            orderNumber: order.orderNumber,
            status: 'PENDING',
            vehicleName,
            startDate: order.startDate,
            endDate: order.endDate,
            storeName: orderDetailForNotify2?.store?.name || '门店',
            orderId: order.id,
            language: user.preferredLanguage as string
          })
          
          console.log('Checkout success email sent for order:', order.id)
        } else {
          console.log('Email already sent for order:', order.id)
        }
      }
    } catch (emailError) {
      console.error('Failed to send checkout success email:', emailError)
    }

    revalidatePath('/orders')
    
    return {
      success: true,
      orderId: order.id
    }
  } catch (error) {
    console.error('处理支付成功回调失败:', error)
    return {
      success: false,
      error: '处理支付失败'
    }
  }
}

// 处理Stripe Checkout取消回调
export async function handleCheckoutCancel(orderId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return {
        success: false,
        error: '请先登录'
      }
    }

    // 验证订单属于当前用户
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: session.user.id,
        status: 'PENDING'
      }
    })

    if (!order) {
      return {
        success: false,
        error: '订单不存在或已处理'
      }
    }

    // 取消订单
    await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: { status: 'CANCELLED' }
      }),
      prisma.payment.updateMany({
        where: { 
          orderId: order.id,
          status: 'PENDING'
        },
        data: { 
          status: 'FAILED'
        }
      })
    ])

    revalidatePath('/orders')
    
    return {
      success: true,
      message: '订单已取消'
    }
  } catch (error) {
    console.error('处理支付取消回调失败:', error)
    return {
      success: false,
      error: '处理取消失败'
    }
  }
}

// 为未支付订单创建新的支付链接
export async function createPaymentLink(orderId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return {
        success: false,
        error: '请先登录'
      }
    }

    // 获取订单信息
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: session.user.id,
        status: 'PENDING'
      },
      include: {
        vehicle: true,
        package: true
      }
    })

    if (!order) {
      return {
        success: false,
        error: '订单不存在或已处理'
      }
    }

    // 创建新的Stripe Checkout Session
    const isPackageOrder = !!order.package
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: session.user.email || undefined,
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: isPackageOrder 
                ? `套餐服务 - ${order.package!.name}`
                : `租车服务 - ${order.vehicle!.brand} ${order.vehicle!.model}`,
              description: isPackageOrder
                ? `购买套餐：${order.package!.name}`
                : `租期：${order.startDate.toLocaleDateString()} 至 ${order.endDate.toLocaleDateString()}（${order.totalDays}天）`,
              images: isPackageOrder
                ? (order.package!.images?.length > 0 ? [order.package!.images[0]] : undefined)
                : (order.vehicle!.images?.length > 0 ? [order.vehicle!.images[0]] : undefined),
            },
            unit_amount: Math.round(order.totalAmount * 100) // Stripe JPY需要以分为单位
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
        ...(order.vehicleId && { vehicleId: order.vehicleId }),
        ...(order.packageId && { packageId: order.packageId }),
      },
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30分钟后过期
    })

    // 更新支付记录
    await prisma.payment.updateMany({
      where: { 
        orderId: order.id,
        status: 'PENDING'
      },
      data: { 
        stripePaymentIntentId: checkoutSession.id
      }
    })

    return {
      success: true,
      checkoutUrl: checkoutSession.url
    }
  } catch (error) {
    console.error('创建支付链接失败:', error)
    return {
      success: false,
      error: '创建支付链接失败'
    }
  }
} 