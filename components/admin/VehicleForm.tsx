'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, Save, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  vehicleFormSchema, 
  type VehicleFormData, 
  type VehicleWithStore 
} from '@/lib/schemas/vehicle'
import { createVehicle, updateVehicle, getStoresForSelect } from '@/app/admin/vehicles/actions'
import { MultiImageUpload } from '@/components/ui/multi-image-upload'

interface VehicleFormProps {
  vehicle?: VehicleWithStore
  mode?: 'add' | 'edit' | 'view'
}

interface StoreOption {
  id: string
  name: string
  city: string
}

export function VehicleForm({ vehicle, mode = 'add' }: VehicleFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(mode !== 'view')
  const [stores, setStores] = useState<StoreOption[]>([])
  const router = useRouter()

  // 准备默认值
  const defaultValues: VehicleFormData = {
    name: vehicle?.name || '',
    brand: vehicle?.brand || '',
    model: vehicle?.model || '',
    year: vehicle?.year?.toString() || '',
    seats: vehicle?.seats?.toString() || '',
    pricePerDay: vehicle?.pricePerDay?.toString() || '',
    description: vehicle?.description || '',
    internalDescription: vehicle?.internalDescription || '',
    images: vehicle?.images || [],
    color: vehicle?.color || '',
    plateNumber: vehicle?.plateNumber || '',
    isAvailable: vehicle?.isAvailable !== undefined ? (vehicle.isAvailable ? 'true' : 'false') : 'true',
    storeId: vehicle?.storeId || '',
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues,
    mode: 'onChange',
  })

  // 加载店面选项
  useEffect(() => {
    const loadStores = async () => {
      try {
        const storeList = await getStoresForSelect()
        setStores(storeList)
      } catch (error) {
        console.error('加载店面列表失败:', error)
      }
    }
    loadStores()
  }, [])

  const onSubmit = async (data: VehicleFormData) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'images' && Array.isArray(value)) {
            // 将图片数组转换为JSON字符串
            formData.append(key, JSON.stringify(value))
          } else {
            formData.append(key, value.toString())
          }
        }
      })

      if (mode === 'add') {
        await createVehicle(formData)
      } else if ((mode === 'edit' || (mode === 'view' && isEditing)) && vehicle) {
        await updateVehicle(vehicle.id, formData)
        // 在视图模式下保存后，退出编辑状态
        if (mode === 'view') {
          setIsEditing(false)
        }
      }
    } catch (error) {
      console.error('提交失败:', error)
      // 检查是否是Next.js的redirect错误，如果是则重新抛出
      if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
        throw error
      }
      alert(error instanceof Error ? error.message : '提交失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (mode === 'view') {
      setIsEditing(false)
      reset(defaultValues)
    } else {
      router.push('/admin/vehicles')
    }
  }

  const isReadOnly = mode === 'view' && !isEditing

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/vehicles">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回车辆列表
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {mode === 'add' ? '添加车辆' : 
               mode === 'edit' ? '编辑车辆' : 
               `车辆详情 - ${vehicle?.name}`}
            </h1>
            {vehicle && mode === 'view' && (
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant={vehicle.isAvailable ? 'default' : 'secondary'}>
                  {vehicle.isAvailable ? '可用' : '不可用'}
                </Badge>
                <span className="text-sm text-gray-500">
                  所属店面: {vehicle.store.name} ({vehicle.store.city})
                </span>
              </div>
            )}
          </div>
        </div>

        {mode === 'view' && (
          <div className="flex space-x-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                编辑车辆
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button 
                  type="submit" 
                  form="vehicle-form"
                  disabled={isLoading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? '保存中...' : '保存更改'}
                </Button>
                <Button onClick={handleCancel} variant="outline">
                  <X className="w-4 h-4 mr-2" />
                  取消
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>车辆信息</CardTitle>
        </CardHeader>
        <CardContent className="pb-8">
          <form id="vehicle-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* 基本信息 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">车辆名称 *</Label>
                {isReadOnly ? (
                  <div className="p-3 bg-gray-50 rounded-md font-medium">
                    {vehicle?.name || '-'}
                  </div>
                ) : (
                  <>
                    <Input
                      id="name"
                      {...register('name')}
                      placeholder="请输入车辆名称"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeId">所属店面 *</Label>
                {isReadOnly ? (
                  <div className="p-3 bg-gray-50 rounded-md">
                    {vehicle?.store ? `${vehicle.store.name} (${vehicle.store.city})` : '-'}
                  </div>
                ) : (
                  <>
                    <Select onValueChange={(value: string) => setValue('storeId', value)} defaultValue={watch('storeId') || ''}>
                      <SelectTrigger className={errors.storeId ? 'border-red-500' : ''}>
                        <SelectValue placeholder="请选择店面" />
                      </SelectTrigger>
                      <SelectContent>
                        {stores.map((store) => (
                          <SelectItem key={store.id} value={store.id}>
                            {store.name} ({store.city})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.storeId && (
                      <p className="text-sm text-red-600">{errors.storeId.message}</p>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* 品牌和型号 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="brand">品牌 *</Label>
                {isReadOnly ? (
                  <div className="p-3 bg-gray-50 rounded-md">
                    {vehicle?.brand || '-'}
                  </div>
                ) : (
                  <>
                    <Input
                      id="brand"
                      {...register('brand')}
                      placeholder="请输入品牌"
                      className={errors.brand ? 'border-red-500' : ''}
                    />
                    {errors.brand && (
                      <p className="text-sm text-red-600">{errors.brand.message}</p>
                    )}
                  </>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">型号 *</Label>
                {isReadOnly ? (
                  <div className="p-3 bg-gray-50 rounded-md">
                    {vehicle?.model || '-'}
                  </div>
                ) : (
                  <>
                    <Input
                      id="model"
                      {...register('model')}
                      placeholder="请输入型号"
                      className={errors.model ? 'border-red-500' : ''}
                    />
                    {errors.model && (
                      <p className="text-sm text-red-600">{errors.model.message}</p>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* 年份、座位数、价格 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="year">年份 *</Label>
                {isReadOnly ? (
                  <div className="p-3 bg-gray-50 rounded-md">
                    {vehicle?.year || '-'}
                  </div>
                ) : (
                  <>
                    <Input
                      id="year"
                      {...register('year')}
                      type="number"
                      placeholder="请输入年份"
                      className={errors.year ? 'border-red-500' : ''}
                    />
                    {errors.year && (
                      <p className="text-sm text-red-600">{errors.year.message}</p>
                    )}
                  </>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="seats">座位数 *</Label>
                {isReadOnly ? (
                  <div className="p-3 bg-gray-50 rounded-md">
                    {vehicle?.seats || '-'}
                  </div>
                ) : (
                  <>
                    <Input
                      id="seats"
                      {...register('seats')}
                      type="number"
                      placeholder="请输入座位数"
                      className={errors.seats ? 'border-red-500' : ''}
                    />
                    {errors.seats && (
                      <p className="text-sm text-red-600">{errors.seats.message}</p>
                    )}
                  </>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricePerDay">日租金 (USD) *</Label>
                {isReadOnly ? (
                  <div className="p-3 bg-gray-50 rounded-md">
                    ${vehicle?.pricePerDay || '-'}
                  </div>
                ) : (
                  <>
                    <Input
                      id="pricePerDay"
                      {...register('pricePerDay')}
                      type="number"
                      step="0.01"
                      placeholder="请输入日租金"
                      className={errors.pricePerDay ? 'border-red-500' : ''}
                    />
                    {errors.pricePerDay && (
                      <p className="text-sm text-red-600">{errors.pricePerDay.message}</p>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* 颜色和车牌号 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="color">颜色</Label>
                {isReadOnly ? (
                  <div className="p-3 bg-gray-50 rounded-md">
                    {vehicle?.color || '-'}
                  </div>
                ) : (
                  <>
                    <Input
                      id="color"
                      {...register('color')}
                      placeholder="请输入颜色"
                      className={errors.color ? 'border-red-500' : ''}
                    />
                    {errors.color && (
                      <p className="text-sm text-red-600">{errors.color.message}</p>
                    )}
                  </>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="plateNumber">车牌号</Label>
                {isReadOnly ? (
                  <div className="p-3 bg-gray-50 rounded-md">
                    {vehicle?.plateNumber || '-'}
                  </div>
                ) : (
                  <>
                    <Input
                      id="plateNumber"
                      {...register('plateNumber')}
                      placeholder="请输入车牌号"
                      className={errors.plateNumber ? 'border-red-500' : ''}
                    />
                    {errors.plateNumber && (
                      <p className="text-sm text-red-600">{errors.plateNumber.message}</p>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* 描述信息 */}
            <div className="space-y-2">
              <Label htmlFor="description">车辆描述</Label>
              {isReadOnly ? (
                <div className="p-3 bg-gray-50 rounded-md min-h-[100px] whitespace-pre-wrap">
                  {vehicle?.description || '-'}
                </div>
              ) : (
                <>
                  <Textarea
                    id="description"
                    {...register('description')}
                    placeholder="请输入车辆描述"
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
              <Label htmlFor="internalDescription">内部描述</Label>
              {isReadOnly ? (
                <div className="p-3 bg-gray-50 rounded-md min-h-[100px] whitespace-pre-wrap">
                  {vehicle?.internalDescription || '-'}
                </div>
              ) : (
                <>
                  <Textarea
                    id="internalDescription"
                    {...register('internalDescription')}
                    placeholder="请输入内部描述（仅管理员可见）"
                    rows={3}
                    className={errors.internalDescription ? 'border-red-500' : ''}
                  />
                  {errors.internalDescription && (
                    <p className="text-sm text-red-600">{errors.internalDescription.message}</p>
                  )}
                </>
              )}
            </div>

            {/* 车辆图片 */}
            <div className="space-y-2">
              <Label>车辆图片</Label>
              {isReadOnly ? (
                <div className="p-3 bg-gray-50 rounded-md min-h-[100px]">
                  {vehicle?.images && vehicle.images.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {vehicle.images.map((url, index) => (
                        <div key={index} className="relative">
                          <img src={url} alt={`车辆图片 ${index + 1}`} className="w-full h-32 object-cover rounded-lg border border-gray-200" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">暂无图片</p>
                  )}
                </div>
              ) : (
                <>
                  <MultiImageUpload
                    value={watch('images') || []}
                    onChange={(urls) => setValue('images', urls)}
                    disabled={isLoading}
                    maxImages={8}
                    placeholder={watch('images')?.length ? "继续添加车辆图片" : "上传车辆图片"}
                  />
                  {/* 隐藏的input字段用于react-hook-form注册 */}
                  <input
                    type="hidden"
                    {...register('images')}
                  />
                  {errors.images && (
                    <p className="text-sm text-red-600">{errors.images.message}</p>
                  )}
                </>
              )}
            </div>

            {/* 可用状态 */}
            <div className="space-y-2">
              <Label htmlFor="isAvailable">车辆状态</Label>
              {isReadOnly ? (
                <div className="p-3 bg-gray-50 rounded-md">
                  <Badge variant={vehicle?.isAvailable ? 'default' : 'secondary'}>
                    {vehicle?.isAvailable ? '可用' : '不可用'}
                  </Badge>
                </div>
              ) : (
                <Select onValueChange={(value: string) => setValue('isAvailable', value as 'true' | 'false')} defaultValue={watch('isAvailable')?.toString()}>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择车辆状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">可用</SelectItem>
                    <SelectItem value="false">不可用</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* 提交按钮 */}
            {!isReadOnly && (
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  取消
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? '保存中...' : (mode === 'add' ? '创建车辆' : '保存更改')}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 