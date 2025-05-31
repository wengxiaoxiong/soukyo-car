import { z } from 'zod'
import type { Prisma } from '@prisma/client'

// Store 基础 schema
export const storeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, '店面名称不能为空').max(100, '店面名称不能超过100个字符'),
  address: z.string().min(1, '详细地址不能为空').max(200, '详细地址不能超过200个字符'),
  city: z.string().min(1, '城市不能为空').max(50, '城市名称不能超过50个字符'),
  state: z.string().max(50, '省份/州名称不能超过50个字符').optional().nullable(),
  zipCode: z.string().max(20, '邮政编码不能超过20个字符').optional().nullable(),
  phone: z.string().min(1, '联系电话不能为空').regex(/^[\d\s\-\+\(\)]+$/, '请输入有效的电话号码'),
  email: z.string().email('请输入有效的邮箱地址').optional().or(z.literal('')).nullable(),
  description: z.string().max(1000, '店面描述不能超过1000个字符').optional().nullable(),
  image: z.string().url('请输入有效的图片URL').optional().or(z.literal('')).nullable(),
  googleMap: z.string().url('请输入有效的Google Maps链接').optional().or(z.literal('')).nullable(),
  latitude: z.coerce.number().min(-90, '纬度范围为-90到90').max(90, '纬度范围为-90到90').optional().nullable(),
  longitude: z.coerce.number().min(-180, '经度范围为-180到180').max(180, '经度范围为-180到180').optional().nullable(),
  openingHours: z.any().optional().nullable(),
  isActive: z.boolean().optional().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

// 从数据库获取的数据 schema（id 必须存在）
export const dbStoreSchema = storeSchema.extend({
  id: z.string(), // 数据库中的记录必须有 id
  createdAt: z.date(),
  updatedAt: z.date(),
})

// 创建店面时的 schema（不需要 id, createdAt, updatedAt）
export const createStoreSchema = storeSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

// 更新店面时的 schema（需要 id）
export const updateStoreSchema = storeSchema.omit({
  createdAt: true,
  updatedAt: true,
})

// 表单数据的 schema（所有字段都是字符串，因为 FormData 只包含字符串）
export const storeFormSchema = z.object({
  name: z.string().min(1, '店面名称不能为空'),
  address: z.string().min(1, '详细地址不能为空'),
  city: z.string().min(1, '城市不能为空'),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  phone: z.string().min(1, '联系电话不能为空'),
  email: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  googleMap: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  openingHours: z.string().optional(),
  isActive: z.union([z.literal('true'), z.literal('false'), z.boolean()]).optional(),
})

// 推断类型
export type Store = z.infer<typeof storeSchema>
export type DbStore = z.infer<typeof dbStoreSchema>
export type CreateStoreInput = z.infer<typeof createStoreSchema>
export type UpdateStoreInput = z.infer<typeof updateStoreSchema>
export type StoreFormData = z.infer<typeof storeFormSchema>

// 表单数据转换为数据库数据的工具函数
export function transformFormDataToStore(formData: StoreFormData): Prisma.StoreCreateInput {
  return {
    name: formData.name,
    address: formData.address,
    city: formData.city,
    state: formData.state || null,
    zipCode: formData.zipCode || null,
    phone: formData.phone,
    email: formData.email || null,
    description: formData.description || null,
    image: formData.image || null,
    googleMap: formData.googleMap || null,
    latitude: formData.latitude ? parseFloat(formData.latitude) : null,
    longitude: formData.longitude ? parseFloat(formData.longitude) : null,
    openingHours: formData.openingHours ? JSON.parse(formData.openingHours) : null,
    isActive: formData.isActive === 'true' || formData.isActive === true,
  }
}

// 验证 JSON 字符串的辅助函数
export function validateJsonString(jsonString: string): boolean {
  if (!jsonString.trim()) return true // 空字符串是有效的
  try {
    JSON.parse(jsonString)
    return true
  } catch {
    return false
  }
} 