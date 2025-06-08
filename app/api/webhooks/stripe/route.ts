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
    
    // 修复：先通过payment表查找订单，因为payment表存储了正确的payment_intent_id
    const payment = await prisma.payment.findFirst({
      where: {
        stripePaymentIntentId: paymentIntent.id
      },
      include: {
        order: true
      }
    })

    if (!payment) {
      console.error('Payment not found for payment intent:', paymentIntent.id)
      return
    }

    const order = payment.order

    // 更新订单状态
    await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: { 
          status: 'CONFIRMED',
          stripePaymentIntentId: paymentIntent.id // 确保orders表也有正确的payment_intent_id
        }
      }),
      prisma.payment.updateMany({
        where: { 
          orderId: order.id,
          stripePaymentIntentId: paymentIntent.id 
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
        userId: order.userId,
        title: '支付成功',
        message: `您的订单 ${order.orderNumber} 支付成功，订单已确认。`,
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
    
    // 修复：先通过payment表查找订单
    const payment = await prisma.payment.findFirst({
      where: {
        stripePaymentIntentId: paymentIntent.id
      },
      include: {
        order: true
      }
    })

    if (!payment) {
      console.error('Payment not found for payment intent:', paymentIntent.id)
      return
    }

    const order = payment.order

    // 更新支付状态
    await prisma.payment.updateMany({
      where: { 
        orderId: order.id,
        stripePaymentIntentId: paymentIntent.id 
      },
      data: { 
        status: 'FAILED'
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