'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ImageUpload } from '@/components/ui/image-upload'
import { ArrowLeft, Save, Edit, Eye } from 'lucide-react'
import Link from 'next/link'
import { storeFormSchema, type Store, type StoreFormData, validateJsonString } from '@/lib/schemas/store'
import { updateStore, createStore } from '@/app/[locale]/admin/stores/actions'

type FormMode = 'add' | 'edit' | 'view'

interface StoreFormProps {
  store?: Store
  mode?: FormMode
}

export function StoreForm({ store, mode = 'add' }: StoreFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(mode !== 'view')

  // 准备默认值
  const defaultValues: Partial<StoreFormData> = {
    name: store?.name || '',
    address: store?.address || '',
    city: store?.city || '',
    state: store?.state || '',
    zipCode: store?.zipCode || '',
    phone: store?.phone || '',
    email: store?.email || '',
    description: store?.description || '',
    image: store?.image || '',
    googleMap: store?.googleMap || '',
    latitude: store?.latitude?.toString() || '',
    longitude: store?.longitude?.toString() || '',
    openingHours: store?.openingHours ? JSON.stringify(store.openingHours, null, 2) : '',
    isActive: store?.isActive ? 'true' : 'false',
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<StoreFormData>({
    resolver: zodResolver(storeFormSchema.extend({
      // 添加自定义验证规则
      openingHours: storeFormSchema.shape.openingHours.refine(
        (value) => !value || validateJsonString(value),
        { message: '营业时间必须是有效的JSON格式' }
      ),
      email: storeFormSchema.shape.email.refine(
        (value) => !value || value === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        { message: '请输入有效的邮箱地址' }
      ),
    })),
    defaultValues,
    mode: 'onChange',
  })

  const onSubmit = async (data: StoreFormData) => {
    setIsLoading(true)
    try {
      // 将表单数据转换为 FormData
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString())
        }
      })

      if ((mode === 'edit' || (mode === 'view' && isEditing)) && store?.id) {
        await updateStore(store.id, formData)
      } else if (mode === 'add') {
        await createStore(formData)
      }
      // 如果执行到这里没有抛出错误，说明操作成功
      // 注意：在App Router中，redirect会抛出NEXT_REDIRECT错误，但这是正常的重定向行为
    } catch (error) {
      // 检查是否是Next.js的重定向错误，如果是则不显示错误消息
      if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
        return // 这是正常的重定向，不是真正的错误
      }
      
      // 只有真正的错误才显示错误消息
      const message = error instanceof Error ? error.message : '操作失败，请重试'
      alert(message)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleEditMode = () => {
    setIsEditing(!isEditing)
    if (!isEditing) {
      // 重置表单到原始值
      reset(defaultValues)
    }
  }

  const getTitle = () => {
    switch (mode) {
      case 'add':
        return '添加店面'
      case 'edit':
        return '编辑店面'
      case 'view':
        return '店面详情'
      default:
        return '店面表单'
    }
  }

  const getSubtitle = () => {
    switch (mode) {
      case 'add':
        return '创建一个新的店面'
      case 'edit':
        return '修改店面信息'
      case 'view':
        return '查看店面详细信息'
      default:
        return ''
    }
  }

  const isReadOnly = mode === 'view' && !isEditing

  return (
    <div className="max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <Link href="/admin/stores">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回列表
          </Button>
        </Link>
        
        {mode === 'view' && (
          <div className="flex items-center space-x-2">
            {store?.isActive !== undefined && (
              <Badge variant={store.isActive ? 'default' : 'secondary'}>
                {store.isActive ? '营业中' : '已关闭'}
              </Badge>
            )}
            <Link href={`/admin/stores/${store?.id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                编辑店面
              </Button>
            </Link>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={toggleEditMode}
            >
              {isEditing ? (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  查看模式
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  内联编辑
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{getTitle()}</h1>
        <p className="text-gray-600 mt-2">{getSubtitle()}</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 店面图片上传 */}
          <div className="space-y-2">
            <Label>店面图片</Label>
            {isReadOnly ? (
              store?.image && (
                <div className="mt-2">
                  <img
                    src={store.image}
                    alt={store.name || '店面图片'}
                    className="w-full h-64 object-cover rounded-lg border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )
            ) : (
              <>
                <ImageUpload
                  value={watch('image')}
                  onChange={(url) => setValue('image', url)}
                  disabled={isLoading}
                  placeholder="上传店面图片"
                />
                {/* 隐藏的input字段用于react-hook-form注册 */}
                <input
                  type="hidden"
                  {...register('image')}
                />
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">店面名称 *</Label>
              {isReadOnly ? (
                <div className="p-3 bg-gray-50 rounded-md font-medium">
                  {store?.name || '-'}
                </div>
              ) : (
                <>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="请输入店面名称"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name.message}</p>
                  )}
                </>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">联系电话 *</Label>
              {isReadOnly ? (
                <div className="p-3 bg-gray-50 rounded-md">
                  {store?.phone || '-'}
                </div>
              ) : (
                <>
                  <Input
                    id="phone"
                    {...register('phone')}
                    placeholder="请输入联系电话"
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">详细地址 *</Label>
            {isReadOnly ? (
              <div className="p-3 bg-gray-50 rounded-md">
                {store?.address || '-'}
              </div>
            ) : (
              <>
                <Input
                  id="address"
                  {...register('address')}
                  placeholder="请输入详细地址"
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && (
                  <p className="text-sm text-red-600">{errors.address.message}</p>
                )}
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="city">城市 *</Label>
              {isReadOnly ? (
                <div className="p-3 bg-gray-50 rounded-md">
                  {store?.city || '-'}
                </div>
              ) : (
                <>
                  <Input
                    id="city"
                    {...register('city')}
                    placeholder="请输入城市"
                    className={errors.city ? 'border-red-500' : ''}
                  />
                  {errors.city && (
                    <p className="text-sm text-red-600">{errors.city.message}</p>
                  )}
                </>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">省份/州</Label>
              {isReadOnly ? (
                <div className="p-3 bg-gray-50 rounded-md">
                  {store?.state || '-'}
                </div>
              ) : (
                <>
                  <Input
                    id="state"
                    {...register('state')}
                    placeholder="请输入省份或州"
                    className={errors.state ? 'border-red-500' : ''}
                  />
                  {errors.state && (
                    <p className="text-sm text-red-600">{errors.state.message}</p>
                  )}
                </>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">邮政编码</Label>
              {isReadOnly ? (
                <div className="p-3 bg-gray-50 rounded-md">
                  {store?.zipCode || '-'}
                </div>
              ) : (
                <>
                  <Input
                    id="zipCode"
                    {...register('zipCode')}
                    placeholder="请输入邮政编码"
                    className={errors.zipCode ? 'border-red-500' : ''}
                  />
                  {errors.zipCode && (
                    <p className="text-sm text-red-600">{errors.zipCode.message}</p>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">邮箱地址</Label>
            {isReadOnly ? (
              <div className="p-3 bg-gray-50 rounded-md">
                {store?.email || '-'}
              </div>
            ) : (
              <>
                <Input
                  id="email"
                  {...register('email')}
                  type="email"
                  placeholder="请输入邮箱地址"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="googleMap">Google Maps链接</Label>
            {isReadOnly ? (
              <div className="p-3 bg-gray-50 rounded-md break-all">
                {store?.googleMap ? (
                  <a 
                    href={store.googleMap} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {store.googleMap}
                  </a>
                ) : '-'}
              </div>
            ) : (
              <>
                <Input
                  id="googleMap"
                  {...register('googleMap')}
                  type="url"
                  placeholder="请输入Google Maps链接"
                  className={errors.googleMap ? 'border-red-500' : ''}
                />
                {errors.googleMap && (
                  <p className="text-sm text-red-600">{errors.googleMap.message}</p>
                )}
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="latitude">纬度</Label>
              {isReadOnly ? (
                <div className="p-3 bg-gray-50 rounded-md">
                  {store?.latitude || '-'}
                </div>
              ) : (
                <>
                  <Input
                    id="latitude"
                    {...register('latitude')}
                    type="number"
                    step="any"
                    placeholder="请输入纬度"
                    className={errors.latitude ? 'border-red-500' : ''}
                  />
                  {errors.latitude && (
                    <p className="text-sm text-red-600">{errors.latitude.message}</p>
                  )}
                </>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="longitude">经度</Label>
              {isReadOnly ? (
                <div className="p-3 bg-gray-50 rounded-md">
                  {store?.longitude || '-'}
                </div>
              ) : (
                <>
                  <Input
                    id="longitude"
                    {...register('longitude')}
                    type="number"
                    step="any"
                    placeholder="请输入经度"
                    className={errors.longitude ? 'border-red-500' : ''}
                  />
                  {errors.longitude && (
                    <p className="text-sm text-red-600">{errors.longitude.message}</p>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">店面描述</Label>
            {isReadOnly ? (
              <div className="p-3 bg-gray-50 rounded-md whitespace-pre-wrap">
                {store?.description || '-'}
              </div>
            ) : (
              <>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="请输入店面描述"
                  rows={4}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description.message}</p>
                )}
              </>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="openingHours">营业时间</Label>
            {isReadOnly ? (
              <div className="p-3 bg-gray-50 rounded-md">
                {store?.openingHours ? (
                  <pre className="whitespace-pre-wrap font-mono text-xs">
                    {JSON.stringify(store.openingHours, null, 2)}
                  </pre>
                ) : '-'}
              </div>
            ) : (
              <>
                <Textarea
                  id="openingHours"
                  {...register('openingHours')}
                  placeholder='例如: {"monday": "9:00-18:00", "tuesday": "9:00-18:00"}'
                  rows={3}
                  className={errors.openingHours ? 'border-red-500' : ''}
                />
                {errors.openingHours && (
                  <p className="text-sm text-red-600">{errors.openingHours.message}</p>
                )}
              </>
            )}
          </div>

          {(mode === 'edit' || (mode === 'view' && isEditing)) && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                {...register('isActive')}
                value="true"
                disabled={isReadOnly}
                className="rounded border-gray-300"
              />
              <Label htmlFor="isActive">店面激活状态</Label>
            </div>
          )}

          {/* 在view模式只读状态下显示激活状态 */}
          {mode === 'view' && !isEditing && store?.isActive !== undefined && (
            <div className="space-y-2">
              <Label>店面状态</Label>
              <div className="p-3 bg-gray-50 rounded-md">
                <Badge variant={store.isActive ? 'default' : 'secondary'}>
                  {store.isActive ? '营业中' : '已关闭'}
                </Badge>
              </div>
            </div>
          )}

          {/* 时间信息显示 */}
          {mode === 'view' && store?.createdAt && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
              <div className="space-y-2">
                <Label>创建时间</Label>
                <div className="p-3 bg-gray-50 rounded-md">
                  {new Date(store.createdAt).toLocaleString('zh-CN')}
                </div>
              </div>
              <div className="space-y-2">
                <Label>更新时间</Label>
                <div className="p-3 bg-gray-50 rounded-md">
                  {store.updatedAt ? new Date(store.updatedAt).toLocaleString('zh-CN') : '-'}
                </div>
              </div>
            </div>
          )}

          {!isReadOnly && (
            <div className="flex gap-4 pt-6">
              <Button type="submit" disabled={isLoading} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? '保存中...' : (mode === 'edit' || isEditing ? '更新店面' : '创建店面')}
              </Button>
              <Link href="/admin/stores" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  取消
                </Button>
              </Link>
            </div>
          )}
        </form>
      </Card>
    </div>
  )
} 