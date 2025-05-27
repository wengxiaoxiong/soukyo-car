'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { createStore, updateStore } from '@/app/admin/stores/actions'

interface Store {
  id?: string
  name: string
  address: string
  city: string
  state?: string | null
  zipCode?: string | null
  phone: string
  email?: string | null
  description?: string | null
  image?: string | null
  latitude?: number | null
  longitude?: number | null
  openingHours?: Record<string, unknown> | null
  isActive?: boolean
}

interface StoreFormProps {
  store?: Store
  isEdit?: boolean
}

export function StoreForm({ store, isEdit = false }: StoreFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    try {
      if (isEdit && store?.id) {
        await updateStore(store.id, formData)
      } else {
        await createStore(formData)
      }
    } catch {
      alert(isEdit ? '更新失败，请重试' : '创建失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href="/admin/stores">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回列表
          </Button>
        </Link>
      </div>

      <Card className="p-6">
        <form action={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">店面名称 *</Label>
              <Input
                id="name"
                name="name"
                defaultValue={store?.name || ''}
                required
                placeholder="请输入店面名称"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">联系电话 *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={store?.phone || ''}
                required
                placeholder="请输入联系电话"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">详细地址 *</Label>
            <Input
              id="address"
              name="address"
              defaultValue={store?.address || ''}
              required
              placeholder="请输入详细地址"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="city">城市 *</Label>
              <Input
                id="city"
                name="city"
                defaultValue={store?.city || ''}
                required
                placeholder="请输入城市"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">省份/州</Label>
              <Input
                id="state"
                name="state"
                defaultValue={store?.state || ''}
                placeholder="请输入省份或州"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">邮政编码</Label>
              <Input
                id="zipCode"
                name="zipCode"
                defaultValue={store?.zipCode || ''}
                placeholder="请输入邮政编码"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">邮箱地址</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={store?.email || ''}
              placeholder="请输入邮箱地址"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">店面图片URL</Label>
            <Input
              id="image"
              name="image"
              type="url"
              defaultValue={store?.image || ''}
              placeholder="请输入图片URL"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="latitude">纬度</Label>
              <Input
                id="latitude"
                name="latitude"
                type="number"
                step="any"
                defaultValue={store?.latitude || ''}
                placeholder="请输入纬度"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="longitude">经度</Label>
              <Input
                id="longitude"
                name="longitude"
                type="number"
                step="any"
                defaultValue={store?.longitude || ''}
                placeholder="请输入经度"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">店面描述</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={store?.description || ''}
              placeholder="请输入店面描述"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="openingHours">营业时间 (JSON格式)</Label>
            <Textarea
              id="openingHours"
              name="openingHours"
              defaultValue={store?.openingHours ? JSON.stringify(store.openingHours, null, 2) : ''}
              placeholder='例如: {"monday": "9:00-18:00", "tuesday": "9:00-18:00"}'
              rows={3}
            />
          </div>

          {isEdit && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                value="true"
                defaultChecked={store?.isActive}
                className="rounded border-gray-300"
              />
              <Label htmlFor="isActive">店面激活状态</Label>
            </div>
          )}

          <div className="flex gap-4 pt-6">
            <Button type="submit" disabled={isLoading} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? '保存中...' : (isEdit ? '更新店面' : '创建店面')}
            </Button>
            <Link href="/admin/stores" className="flex-1">
              <Button type="button" variant="outline" className="w-full">
                取消
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
} 