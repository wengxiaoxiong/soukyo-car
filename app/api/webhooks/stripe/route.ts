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
    
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ received: true })
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  try {
    // 查找对应的订单
    const order = await prisma.order.findFirst({
      where: {
        stripePaymentIntentId: paymentIntent.id
      }
    })

    if (!order) {
      console.error('Order not found for payment intent:', paymentIntent.id)
      return
    }

    // 更新订单状态
    await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: { status: 'CONFIRMED' }
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
    // 查找对应的订单
    const order = await prisma.order.findFirst({
      where: {
        stripePaymentIntentId: paymentIntent.id
      }
    })

    if (!order) {
      console.error('Order not found for payment intent:', paymentIntent.id)
      return
    }

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