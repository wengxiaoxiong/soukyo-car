import { z } from 'zod'
import type { Prisma } from '@prisma/client'

// Vehicle 基础 schema
export const vehicleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, '车辆名称不能为空').max(100, '车辆名称不能超过100个字符'),
  brand: z.string().min(1, '品牌不能为空').max(50, '品牌名称不能超过50个字符'),
  model: z.string().min(1, '型号不能为空').max(50, '型号不能超过50个字符'),
  year: z.coerce.number().int().min(1900, '年份不能早于1900年').max(new Date().getFullYear() + 1, '年份不能超过下一年'),
  seats: z.coerce.number().int().min(1, '座位数不能小于1').max(50, '座位数不能超过50'),
  pricePerDay: z.coerce.number().min(0, '日租金不能为负数').max(9999, '日租金不能超过9999'),
  description: z.string().max(2000, '车辆描述不能超过2000个字符').optional().nullable(),
  internalDescription: z.string().max(2000, '内部描述不能超过2000个字符').optional().nullable(),
  images: z.array(z.string().url('请输入有效的图片URL')).default([]),
  color: z.string().max(50, '颜色名称不能超过50个字符').optional().nullable(),
  plateNumber: z.string().max(20, '车牌号不能超过20个字符').optional().nullable(),
  isAvailable: z.boolean().optional().default(true),
  storeId: z.string().min(1, '必须选择所属店面'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

// 从数据库获取的数据 schema（id 必须存在）
export const dbVehicleSchema = vehicleSchema.extend({
  id: z.string(), // 数据库中的记录必须有 id
  createdAt: z.date(),
  updatedAt: z.date(),
})

// 包含店面信息的车辆 schema
export const vehicleWithStoreSchema = dbVehicleSchema.extend({
  store: z.object({
    id: z.string(),
    name: z.string(),
    city: z.string(),
  }),
})

// 创建车辆时的 schema（不需要 id, createdAt, updatedAt）
export const createVehicleSchema = vehicleSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

// 更新车辆时的 schema（需要 id）
export const updateVehicleSchema = vehicleSchema.omit({
  createdAt: true,
  updatedAt: true,
})

// 表单数据的 schema（支持图片数组）
export const vehicleFormSchema = z.object({
  name: z.string().min(1, '车辆名称不能为空'),
  brand: z.string().min(1, '品牌不能为空'),
  model: z.string().min(1, '型号不能为空'),
  year: z.string().min(1, '年份不能为空'),
  seats: z.string().min(1, '座位数不能为空'),
  pricePerDay: z.string().min(1, '日租金不能为空'),
  description: z.string().optional(),
  internalDescription: z.string().optional(),
  images: z.array(z.string().min(1).url('请输入有效的图片URL')), // 图片URL数组，必需字段
  color: z.string().optional(),
  plateNumber: z.string().optional(),
  isAvailable: z.union([z.literal('true'), z.literal('false'), z.boolean()]).optional(),
  storeId: z.string().min(1, '必须选择所属店面'),
})

// FormData 表单数据的 schema（所有字段都是字符串，因为 FormData 只包含字符串）
export const vehicleFormDataSchema = z.object({
  name: z.string().min(1, '车辆名称不能为空'),
  brand: z.string().min(1, '品牌不能为空'),
  model: z.string().min(1, '型号不能为空'),
  year: z.string().min(1, '年份不能为空'),
  seats: z.string().min(1, '座位数不能为空'),
  pricePerDay: z.string().min(1, '日租金不能为空'),
  description: z.string().optional(),
  internalDescription: z.string().optional(),
  images: z.string().optional(), // JSON字符串格式的图片URL数组
  color: z.string().optional(),
  plateNumber: z.string().optional(),
  isAvailable: z.union([z.literal('true'), z.literal('false'), z.boolean()]).optional(),
  storeId: z.string().min(1, '必须选择所属店面'),
})

// 推断类型
export type Vehicle = z.infer<typeof vehicleSchema>
export type DbVehicle = z.infer<typeof dbVehicleSchema>
export type VehicleWithStore = z.infer<typeof vehicleWithStoreSchema>
export type CreateVehicleInput = z.infer<typeof createVehicleSchema>
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>
export type VehicleFormData = z.infer<typeof vehicleFormSchema>
export type VehicleFormDataString = z.infer<typeof vehicleFormDataSchema>

// 表单数据转换为数据库数据的工具函数
export function transformFormDataToVehicle(formData: VehicleFormData): Prisma.VehicleCreateInput {
  return {
    name: formData.name,
    brand: formData.brand,
    model: formData.model,
    year: parseInt(formData.year),
    seats: parseInt(formData.seats),
    pricePerDay: parseFloat(formData.pricePerDay),
    description: formData.description || null,
    internalDescription: formData.internalDescription || null,
    images: formData.images || [],
    color: formData.color || null,
    plateNumber: formData.plateNumber || null,
    isAvailable: formData.isAvailable === 'true' || formData.isAvailable === true,
    store: {
      connect: { id: formData.storeId }
    }
  }
}

// FormData字符串转换为数据库数据的工具函数
export function transformFormDataStringToVehicle(formData: VehicleFormDataString): Prisma.VehicleCreateInput {
  let images: string[] = []
  if (formData.images && formData.images.trim()) {
    try {
      images = JSON.parse(formData.images)
    } catch {
      // 如果解析失败，当作单个URL处理
      images = [formData.images]
    }
  }

  return {
    name: formData.name,
    brand: formData.brand,
    model: formData.model,
    year: parseInt(formData.year),
    seats: parseInt(formData.seats),
    pricePerDay: parseFloat(formData.pricePerDay),
    description: formData.description || null,
    internalDescription: formData.internalDescription || null,
    images: images,
    color: formData.color || null,
    plateNumber: formData.plateNumber || null,
    isAvailable: formData.isAvailable === 'true' || formData.isAvailable === true,
    store: {
      connect: { id: formData.storeId }
    }
  }
}

// 验证图片URL数组JSON字符串的辅助函数
export function validateImagesJsonString(jsonString: string): boolean {
  if (!jsonString.trim()) return true // 空字符串是有效的
  try {
    const parsed = JSON.parse(jsonString)
    if (!Array.isArray(parsed)) return false
    return parsed.every(item => typeof item === 'string' && item.length > 0)
  } catch {
    return false
  }
} 