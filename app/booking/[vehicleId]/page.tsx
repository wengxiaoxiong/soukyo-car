'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { BookingForm } from '@/components/BookingForm'
import { createBooking } from '@/lib/actions/booking'
import { getVehicleById } from '@/lib/actions/cars'
import { useSession } from 'next-auth/react'
import { Loader2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Link from 'next/link'

export default function BookingPage() {
  const params = useParams()
  const router = useRouter()
  const { status } = useSession()
  const vehicleId = params.vehicleId as string

  const [vehicle, setVehicle] = useState<Parameters<typeof BookingForm>[0]['vehicle'] | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // 获取车辆信息
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const result = await getVehicleById(vehicleId)
        if (result.success && result.vehicle) {
          // 转换数据以匹配组件期望的类型
          const transformedVehicle = {
            ...result.vehicle,
            description: result.vehicle.description || undefined
          }
          setVehicle(transformedVehicle)
        } else {
          toast.error('车辆不存在')
          router.push('/vehicle')
        }
      } catch {
        toast.error('获取车辆信息失败')
        router.push('/vehicle')
      }
      setLoading(false)
    }

    if (vehicleId) {
      fetchVehicle()
    }
  }, [vehicleId, router])

  // 检查登录状态
  useEffect(() => {
    if (status === 'unauthenticated') {
      toast.error('请先登录')
      router.push('/auth/signin')
    }
  }, [status, router])

  const handleBookingSubmit = async (formData: {
    vehicleId: string
    startDate: string
    endDate: string
    driverLicense: string
    emergencyContact?: string
    emergencyPhone?: string
    notes?: string
  }) => {
    setSubmitting(true)
    try {
      const result = await createBooking(formData)
      
      if (result.success && 'checkoutUrl' in result && result.checkoutUrl) {
        // 直接跳转到Stripe Checkout页面
        window.location.href = result.checkoutUrl
      } else {
        toast.error(result.error || '创建订单失败')
        setSubmitting(false)
      }
    } catch {
      toast.error('创建订单失败')
      setSubmitting(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">正在加载...</p>
        </div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">车辆不存在</p>
          <Link href="/vehicle">
            <Button>返回车辆列表</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面标题 */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link href="/vehicle">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">预订车辆</h1>
              <p className="text-gray-600">填写预订信息，完成后将跳转到安全支付页面</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        <BookingForm
          vehicle={vehicle}
          onSubmit={handleBookingSubmit}
          loading={submitting}
        />
      </div>
    </div>
  )
} 