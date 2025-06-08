'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Stripe from 'stripe'
import { z } from 'zod'

// 初始化Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
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

    // 创建通知
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        title: '订单确认成功',
        message: `您的订单 ${order.orderNumber} 已确认，请按时取车。`,
        type: 'ORDER',
        relatedOrderId: order.id
      }
    })

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
        vehicle: {
          include: {
            store: true
          }
        },
        store: true,
        payments: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        user: true
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

    // 创建通知
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        title: '订单已取消',
        message: `您的订单 ${order.orderNumber} 已取消。`,
        type: 'ORDER',
        relatedOrderId: order.id
      }
    })

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
          stripePaymentIntentId: sessionId
        },
        data: { 
          status: 'SUCCESS',
          stripeChargeId: checkoutSession.payment_intent as string
        }
      })
    ])

    // 创建通知
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        title: '订单确认成功',
        message: `您的订单 ${order.orderNumber} 已确认，请按时取车。`,
        type: 'ORDER',
        relatedOrderId: order.id
      }
    })

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
        vehicle: true
      }
    })

    if (!order) {
      return {
        success: false,
        error: '订单不存在或已处理'
      }
    }

    // 创建新的Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: session.user.email || undefined,
      line_items: [
        {
          price_data: {
            currency: 'cny',
            product_data: {
              name: `租车服务 - ${order.vehicle.brand} ${order.vehicle.model}`,
              description: `租期：${order.startDate.toLocaleDateString()} 至 ${order.endDate.toLocaleDateString()}（${order.totalDays}天）`,
              images: order.vehicle.images?.length > 0 ? [order.vehicle.images[0]] : undefined,
            },
            unit_amount: order.totalAmount
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
        vehicleId: order.vehicleId,
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