'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { handleCheckoutCancel } from '@/lib/actions/booking'
import { useSession } from 'next-auth/react'
import { XCircle, Loader2, ArrowLeft, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Link from 'next/link'

export default function PaymentCancelPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { status } = useSession()
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const orderIdParam = searchParams.get('order_id')

    if (status === 'loading') return

    if (status === 'unauthenticated') {
      toast.error('请先登录')
      router.push('/auth/signin')
      return
    }

    if (!orderIdParam) {
      setError('缺少订单信息')
      setLoading(false)
      return
    }

    const processCancel = async () => {
      try {
        const result = await handleCheckoutCancel(orderIdParam)
        
        if (result.success) {
          toast.info('已取消支付，订单已取消')
        } else {
          setError(result.error || '处理取消失败')
        }
      } catch {
        setError('处理取消时发生错误')
      }
      
      setLoading(false)
    }

    processCancel()
  }, [status, searchParams, router])

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">处理中...</h2>
          <p className="text-gray-600">请稍候，我们正在处理您的请求</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {!error ? (
            <>
              <XCircle className="w-20 h-20 text-orange-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">支付已取消</h1>
              <p className="text-lg text-gray-600 mb-8">
                您已取消支付，订单已被取消。如需继续租车，请重新选择车辆。
              </p>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-8">
                <p className="text-orange-800">
                  如果您遇到支付问题，请联系客服获取帮助。
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/vehicle">
                  <Button size="lg" className="w-full sm:w-auto">
                    <CreditCard className="mr-2 w-4 h-4" />
                    重新选择车辆
                  </Button>
                </Link>
                <Link href="/orders">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    查看我的订单
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="lg" 
                  className="w-full sm:w-auto"
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  返回上一页
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">❌</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">处理失败</h1>
              <p className="text-lg text-gray-600 mb-8">
                {error || '处理取消时发生错误'}
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