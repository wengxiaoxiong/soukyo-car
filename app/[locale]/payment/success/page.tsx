'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { handleCheckoutSuccess } from '@/lib/actions/booking'
import { useSession } from 'next-auth/react'
import { CheckCircle, Loader2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Link from 'next/link'

function PaymentSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { status } = useSession()
  
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    const orderIdParam = searchParams.get('order_id')

    if (status === 'loading') return

    if (status === 'unauthenticated') {
      toast.error('请先登录')
      router.push('/auth/signin')
      return
    }

    if (!sessionId || !orderIdParam) {
      setError('缺少必要参数')
      setLoading(false)
      return
    }

    const processPayment = async () => {
      try {
        const result = await handleCheckoutSuccess(sessionId, orderIdParam)
        
        if (result.success) {
          setSuccess(true)
          setOrderId(result.orderId || null)
          toast.success('支付成功！订单已确认')
        } else {
          setError(result.error || '处理支付失败')
          toast.error(result.error || '处理支付失败')
        }
      } catch {
        setError('处理支付时发生错误')
        toast.error('处理支付时发生错误')
      }
      
      setLoading(false)
    }

    processPayment()
  }, [status, searchParams, router])

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">处理支付中...</h2>
          <p className="text-gray-600">请稍候，我们正在确认您的支付</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {success ? (
            <>
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">支付成功！</h1>
              <p className="text-lg text-gray-600 mb-8">
                您的租车订单已确认，感谢您的信任！
              </p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
                <p className="text-green-800">
                  订单确认邮件已发送至您的邮箱，请按时取车。
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {orderId && (
                  <Link href={`/orders/${orderId}`}>
                    <Button size="lg" className="w-full sm:w-auto">
                      查看订单详情
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                )}
                <Link href="/orders">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    我的所有订单
                  </Button>
                </Link>
                <Link href="/vehicle">
                  <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                    继续浏览车辆
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">❌</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">支付处理失败</h1>
              <p className="text-lg text-gray-600 mb-8">
                {error || '处理支付时发生错误，请重试'}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/orders">
                  <Button size="lg" className="w-full sm:w-auto">
                    查看我的订单
                  </Button>
                </Link>
                <Link href="/vehicle">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    重新选择车辆
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">加载中...</h2>
        <p className="text-gray-600">请稍候</p>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentSuccessContent />
    </Suspense>
  )
} 