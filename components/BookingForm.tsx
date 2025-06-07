'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Car, MapPin, CreditCard } from 'lucide-react'
import { toast } from 'sonner'

interface Vehicle {
  id: string
  name: string
  brand: string
  model: string
  year: number
  seats: number
  pricePerDay: number
  description?: string
  images: string[]
  store: {
    id: string
    name: string
    address: string
    city: string
  }
}

interface BookingFormData {
  vehicleId: string
  startDate: string
  endDate: string
  driverLicense: string
  emergencyContact?: string
  emergencyPhone?: string
  notes?: string
}

interface BookingFormProps {
  vehicle: Vehicle
  onSubmit: (formData: BookingFormData) => void
  loading?: boolean
}

export function BookingForm({ vehicle, onSubmit, loading = false }: BookingFormProps) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [driverLicense, setDriverLicense] = useState('')
  const [emergencyContact, setEmergencyContact] = useState('')
  const [emergencyPhone, setEmergencyPhone] = useState('')
  const [notes, setNotes] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!startDate || !endDate) {
      toast.error('请选择租车日期')
      return
    }

    if (!driverLicense.trim()) {
      toast.error('请填写驾驶证号码')
      return
    }

    // 验证日期
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (start >= end) {
      toast.error('结束日期必须晚于开始日期')
      return
    }

    if (start < new Date()) {
      toast.error('开始日期不能早于今天')
      return
    }

    onSubmit({
      vehicleId: vehicle.id,
      startDate,
      endDate,
      driverLicense: driverLicense.trim(),
      emergencyContact: emergencyContact.trim() || undefined,
      emergencyPhone: emergencyPhone.trim() || undefined,
      notes: notes.trim() || undefined
    })
  }

  // 计算预估价格
  const calculateEstimatedPrice = () => {
    if (!startDate || !endDate) return null
    
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (start >= end) return null
    
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    const subtotal = totalDays * vehicle.pricePerDay
    const taxAmount = subtotal * 0.1
    const totalAmount = subtotal + taxAmount
    
    return {
      totalDays,
      subtotal,
      taxAmount,
      totalAmount
    }
  }

  const priceEstimate = calculateEstimatedPrice()

  return (
    <div className="space-y-6">
      {/* 车辆信息摘要 */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
            {vehicle.images.length > 0 ? (
              <img 
                src={vehicle.images[0]} 
                alt={vehicle.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Car className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{vehicle.name}</h3>
            <p className="text-gray-600">{vehicle.brand} {vehicle.model} • {vehicle.year}年 • {vehicle.seats}座</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{vehicle.store.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <CreditCard className="w-4 h-4" />
                <span>¥{vehicle.pricePerDay}/天</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 租车日期 */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">租车日期</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">取车日期</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date">还车日期</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          {/* 价格预估 */}
          {priceEstimate && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">价格预估</h4>
              <div className="space-y-1 text-sm text-green-800">
                <div className="flex justify-between">
                  <span>租期：{priceEstimate.totalDays} 天</span>
                </div>
                <div className="flex justify-between">
                  <span>车辆费用：</span>
                  <span>¥{priceEstimate.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>税费 (10%)：</span>
                  <span>¥{priceEstimate.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-1">
                  <span>总计：</span>
                  <span>¥{priceEstimate.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 驾驶员信息 */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">驾驶员信息</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="driver-license">驾驶证号码 *</Label>
              <Input
                id="driver-license"
                placeholder="请输入驾驶证号码"
                value={driverLicense}
                onChange={(e) => setDriverLicense(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergency-contact">紧急联系人</Label>
                <Input
                  id="emergency-contact"
                  placeholder="紧急联系人姓名"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergency-phone">紧急联系电话</Label>
                <Input
                  id="emergency-phone"
                  placeholder="紧急联系电话"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">备注</Label>
              <Textarea
                id="notes"
                placeholder="其他需要说明的事项（可选）"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </div>
        </div>

        {/* 提交按钮 */}
        <div className="bg-white rounded-lg border p-6">
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                正在处理...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                确认预订并支付
              </>
            )}
          </Button>
          
          {priceEstimate && (
            <p className="text-center text-sm text-gray-500 mt-2">
              点击确认后将跳转到支付页面，预估总金额 ¥{priceEstimate.totalAmount.toFixed(2)}
            </p>
          )}
        </div>
      </form>
    </div>
  )
} 