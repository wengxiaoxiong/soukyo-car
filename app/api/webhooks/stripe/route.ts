import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const headersList = await headers()
  const sig = headersList.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // 处理事件
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      await handlePaymentSuccess(paymentIntent)
      break
    
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object as Stripe.PaymentIntent
      await handlePaymentFailed(failedPayment)
      break

    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session
      await handleCheckoutCompleted(session)
      break
    
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ received: true })
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    console.log('Handling checkout completed:', session.id)
    
    // 通过checkout session id查找订单
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { stripePaymentIntentId: session.id }, // checkout session id
          { stripePaymentIntentId: session.payment_intent as string }, // payment intent id
        ]
      }
    })

    if (!order) {
      console.error('Order not found for session:', session.id)
      return
    }

    // 检查支付是否成功
    if (session.payment_status === 'paid') {
      await prisma.$transaction([
        prisma.order.update({
          where: { id: order.id },
          data: { 
            status: 'CONFIRMED',
            stripePaymentIntentId: session.payment_intent as string // 更新为真正的payment intent id
          }
        }),
        prisma.payment.updateMany({
          where: { 
            orderId: order.id,
            status: 'PENDING'
          },
          data: { 
            status: 'SUCCESS',
            stripePaymentIntentId: session.payment_intent as string,
            stripeChargeId: null  // checkout session中不直接包含charge ID，后续通过payment_intent.succeeded webhook更新
          }
        })
      ])

      // 创建通知
      await prisma.notification.create({
        data: {
          userId: order.userId,
          title: '支付成功',
          message: `您的订单 ${order.orderNumber} 支付成功，订单已确认。`,
          type: 'ORDER',
          relatedOrderId: order.id
        }
      })

      console.log('Checkout completed handled for order:', order.id)
    }
  } catch (error) {
    console.error('Error handling checkout completed:', error)
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('Handling payment success:', paymentIntent.id)
    
    // 尝试通过payment_intent_id查找
    let payment = await prisma.payment.findFirst({
      where: {
        stripePaymentIntentId: paymentIntent.id
      },
      include: {
        order: true
      }
    })

    console.log('Payment found:', payment)

    // 如果没找到，可能是checkout.session.completed没有执行，尝试通过charge_id查找
    if (!payment) {
      console.log('Payment not found by payment_intent_id, trying to find by charge_id...')
      payment = await prisma.payment.findFirst({
        where: {
          stripeChargeId: paymentIntent.id
        },
        include: {
          order: true
        }
      })
    }

    console.log('Payment found:', payment)

    // 如果还是没找到，尝试通过order表中的checkout session关联查找
    if (!payment) {
      console.log('Payment not found by charge_id, trying to find via checkout session...')
      
      // 获取payment intent的详细信息，包括相关的checkout session
      const checkoutSessions = await stripe.checkout.sessions.list({
        payment_intent: paymentIntent.id,
        limit: 1
      })
      
      if (checkoutSessions.data.length > 0) {
        const sessionId = checkoutSessions.data[0].id
        console.log('Found checkout session:', sessionId)
        
        // 通过checkout session id查找
        payment = await prisma.payment.findFirst({
          where: {
            stripePaymentIntentId: sessionId
          },
          include: {
            order: true
          }
        })
      }
    }

    console.log('Payment found:', payment)

    if (!payment) {
      console.error('Payment not found for payment intent:', paymentIntent.id)
      return
    }

    const order = payment.order

    // 获取订单的完整信息，包括套餐信息
    const fullOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        package: {
          select: { id: true, name: true, stock: true }
        }
      }
    })

    // 更新订单状态和支付信息
    if (fullOrder?.package) {
      // 如果是套餐订单，同时扣减库存
      await prisma.$transaction([
        prisma.order.update({
          where: { id: order.id },
          data: { 
            status: 'CONFIRMED',
            stripePaymentIntentId: paymentIntent.id // 更新为正确的payment_intent_id
          }
        }),
        prisma.payment.updateMany({
          where: { 
            orderId: order.id,
            id: payment.id
          },
          data: { 
            status: 'SUCCESS',
            stripePaymentIntentId: paymentIntent.id, // 更新为正确的payment_intent_id
            stripeChargeId: paymentIntent.latest_charge as string // 更新为正确的charge_id
          }
        }),
        prisma.package.update({
          where: { id: fullOrder.package.id },
          data: { stock: Math.max(0, fullOrder.package.stock - 1) }
        })
      ])
    } else {
      // 如果是车辆订单，只更新订单和支付状态
      await prisma.$transaction([
        prisma.order.update({
          where: { id: order.id },
          data: { 
            status: 'CONFIRMED',
            stripePaymentIntentId: paymentIntent.id // 更新为正确的payment_intent_id
          }
        }),
        prisma.payment.updateMany({
          where: { 
            orderId: order.id,
            id: payment.id
          },
          data: { 
            status: 'SUCCESS',
            stripePaymentIntentId: paymentIntent.id, // 更新为正确的payment_intent_id
            stripeChargeId: paymentIntent.latest_charge as string // 更新为正确的charge_id
          }
        })
      ])
    }

    // 创建通知
    const isPackageOrder = !!fullOrder?.package
    await prisma.notification.create({
      data: {
        userId: order.userId,
        title: '支付成功',
        message: isPackageOrder
          ? `您的套餐订单 ${order.orderNumber} 支付成功，感谢您的购买。`
          : `您的订单 ${order.orderNumber} 支付成功，订单已确认。`,
        type: 'ORDER',
        relatedOrderId: order.id
      }
    })

    console.log('Payment success handled for order:', order.id)
  } catch (error) {
    console.error('Error handling payment success:', error)
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('Handling payment failed:', paymentIntent.id)
    
    // 尝试通过payment_intent_id查找
    let payment = await prisma.payment.findFirst({
      where: {
        stripePaymentIntentId: paymentIntent.id
      },
      include: {
        order: true
      }
    })

    // 如果没找到，尝试通过charge_id查找
    if (!payment) {
      console.log('Payment failed: not found by payment_intent_id, trying charge_id...')
      payment = await prisma.payment.findFirst({
        where: {
          stripeChargeId: paymentIntent.id
        },
        include: {
          order: true
        }
      })
    }

    // 如果还是没找到，尝试通过checkout session查找
    if (!payment) {
      console.log('Payment failed: not found by charge_id, trying checkout session...')
      
      const checkoutSessions = await stripe.checkout.sessions.list({
        payment_intent: paymentIntent.id,
        limit: 1
      })
      
      if (checkoutSessions.data.length > 0) {
        const sessionId = checkoutSessions.data[0].id
        payment = await prisma.payment.findFirst({
          where: {
            stripePaymentIntentId: sessionId
          },
          include: {
            order: true
          }
        })
      }
    }

    if (!payment) {
      console.error('Payment not found for payment intent:', paymentIntent.id)
      return
    }

    const order = payment.order

    // 更新支付状态
    await prisma.payment.updateMany({
      where: { 
        orderId: order.id,
        id: payment.id
      },
      data: { 
        status: 'FAILED',
        stripePaymentIntentId: paymentIntent.id // 也更新payment_intent_id
      }
    })

    // 创建通知
    await prisma.notification.create({
      data: {
        userId: order.userId,
        title: '支付失败',
        message: `您的订单 ${order.orderNumber} 支付失败，请重新尝试支付。`,
        type: 'ORDER',
        relatedOrderId: order.id
      }
    })

    console.log('Payment failure handled for order:', order.id)
  } catch (error) {
    console.error('Error handling payment failure:', error)
  }
} 