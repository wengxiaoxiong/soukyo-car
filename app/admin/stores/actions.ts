'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { storeFormSchema, dbStoreSchema, transformFormDataToStore, type DbStore } from '@/lib/schemas/store'

// 简化的FormData提取函数
function extractFormData(formData: FormData) {
  return Object.fromEntries(formData.entries())
}

export async function getStore(id: string): Promise<DbStore | null> {
  try {
    const rawStore = await prisma.store.findUnique({
      where: { id },
    })
    
    if (!rawStore) {
      return null
    }

    // 使用 Zod 验证从数据库获取的数据
    const validatedStore = dbStoreSchema.parse(rawStore)
    return validatedStore
  } catch (error) {
    console.error('获取店面信息失败:', error)
    return null
  }
}

export async function getStoreWithCounts(id: string) {
  try {
    const rawStore = await prisma.store.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            vehicles: true,
            orders: true,
          },
        },
      },
    })
    
    if (!rawStore) {
      return null
    }

    // 分离计数数据和店面数据
    const { _count, ...storeData } = rawStore
    
    // 验证店面数据
    const validatedStore = dbStoreSchema.parse(storeData)
    
    return {
      ...validatedStore,
      _count,
    }
  } catch (error) {
    console.error('获取店面详情失败:', error)
    return null
  }
}

export async function getAllStores(): Promise<DbStore[]> {
  try {
    const rawStores = await prisma.store.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    // 验证所有店面数据
    const validatedStores = rawStores.map(store => dbStoreSchema.parse(store))
    return validatedStores
  } catch (error) {
    console.error('获取店面列表失败:', error)
    return []
  }
}

export async function createStore(formData: FormData) {
  const user = await getCurrentUser()
  if (!user || (user.role !== 'ADMIN' && user.role !== 'MANAGER')) {
    throw new Error('权限不足')
  }

  try {
    // 提取并验证表单数据
    const rawData = extractFormData(formData)
    const validatedData = storeFormSchema.parse(rawData)
    
    // 转换为数据库格式
    const storeData = transformFormDataToStore(validatedData)

    await prisma.store.create({
      data: storeData,
    })
  } catch (error) {
    console.error('创建店面失败:', error)
    if (error instanceof Error) {
      throw new Error(`创建店面失败: ${error.message}`)
    }
    throw new Error('创建店面失败')
  }

  revalidatePath('/admin/stores')
  redirect('/admin/stores')
}

export async function updateStore(id: string, formData: FormData) {
  const user = await getCurrentUser()
  if (!user || (user.role !== 'ADMIN' && user.role !== 'MANAGER')) {
    throw new Error('权限不足')
  }

  try {
    // 提取并验证表单数据
    const rawData = extractFormData(formData)
    const validatedData = storeFormSchema.parse(rawData)
    
    // 转换为数据库格式
    const storeData = transformFormDataToStore(validatedData)

    await prisma.store.update({
      where: { id },
      data: storeData,
    })
  } catch (error) {
    console.error('更新店面失败:', error)
    if (error instanceof Error) {
      throw new Error(`更新店面失败: ${error.message}`)
    }
    throw new Error('更新店面失败')
  }

  revalidatePath('/admin/stores')
  redirect('/admin/stores')
}

export async function deleteStore(id: string) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') {
    throw new Error('权限不足')
  }

  try {
    await prisma.store.delete({
      where: { id },
    })

    revalidatePath('/admin/stores')
  } catch (error) {
    console.error('删除店面失败:', error)
    throw new Error('删除店面失败')
  }
}

export async function toggleStoreStatus(id: string) {
  const user = await getCurrentUser()
  if (!user || (user.role !== 'ADMIN' && user.role !== 'MANAGER')) {
    throw new Error('权限不足')
  }

  try {
    const store = await prisma.store.findUnique({
      where: { id },
      select: { isActive: true },
    })

    if (!store) {
      throw new Error('店面不存在')
    }

    await prisma.store.update({
      where: { id },
      data: {
        isActive: !store.isActive,
      },
    })

    revalidatePath('/admin/stores')
  } catch (error) {
    console.error('切换店面状态失败:', error)
    throw new Error('切换店面状态失败')
  }
} 