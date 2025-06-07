'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { 
  vehicleFormDataSchema, 
  dbVehicleSchema, 
  vehicleWithStoreSchema,
  transformFormDataStringToVehicle, 
  type DbVehicle,
  type VehicleWithStore
} from '@/lib/schemas/vehicle'

// 简化的FormData提取函数
function extractFormData(formData: FormData) {
  return Object.fromEntries(formData.entries())
}

export async function getVehicle(id: string): Promise<DbVehicle | null> {
  try {
    const rawVehicle = await prisma.vehicle.findUnique({
      where: { id },
    })
    
    if (!rawVehicle) {
      return null
    }

    // 使用 Zod 验证从数据库获取的数据
    const validatedVehicle = dbVehicleSchema.parse(rawVehicle)
    return validatedVehicle
  } catch (error) {
    console.error('获取车辆信息失败:', error)
    return null
  }
}

export async function getVehicleWithStore(id: string): Promise<VehicleWithStore | null> {
  try {
    const rawVehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            city: true,
          }
        }
      },
    })
    
    if (!rawVehicle) {
      return null
    }

    // 使用 Zod 验证从数据库获取的数据
    const validatedVehicle = vehicleWithStoreSchema.parse(rawVehicle)
    return validatedVehicle
  } catch (error) {
    console.error('获取车辆信息失败:', error)
    return null
  }
}

export async function getVehicles(): Promise<VehicleWithStore[]> {
  try {
    const rawVehicles = await prisma.vehicle.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            city: true,
          }
        }
      },
    })
    
    // 验证每个车辆数据
    const validatedVehicles = rawVehicles.map(rawVehicle => {
      return vehicleWithStoreSchema.parse(rawVehicle)
    })
    
    return validatedVehicles
  } catch (error) {
    console.error('获取车辆列表失败:', error)
    return []
  }
}

export async function createVehicle(formData: FormData) {
  const user = await getCurrentUser()
  if (!user || (user.role !== 'ADMIN' && user.role !== 'MANAGER')) {
    throw new Error('权限不足')
  }

  try {
    // 提取并验证表单数据
    const rawData = extractFormData(formData)
    const validatedData = vehicleFormDataSchema.parse(rawData)
    
    // 转换为数据库格式
    const vehicleData = transformFormDataStringToVehicle(validatedData)

    await prisma.vehicle.create({
      data: vehicleData,
    })
  } catch (error) {
    console.error('创建车辆失败:', error)
    if (error instanceof Error) {
      throw new Error(`创建车辆失败: ${error.message}`)
    }
    throw new Error('创建车辆失败')
  }

  revalidatePath('/admin/vehicles')
  redirect('/admin/vehicles')
}

export async function updateVehicle(id: string, formData: FormData) {
  const user = await getCurrentUser()
  if (!user || (user.role !== 'ADMIN' && user.role !== 'MANAGER')) {
    throw new Error('权限不足')
  }

  try {
    // 提取并验证表单数据
    const rawData = extractFormData(formData)
    const validatedData = vehicleFormDataSchema.parse(rawData)
    
    // 转换为数据库格式（更新时不需要store连接，直接设置storeId）
    let images: string[] = []
    if (validatedData.images && validatedData.images.trim()) {
      try {
        images = JSON.parse(validatedData.images)
      } catch {
        // 如果解析失败，当作单个URL处理
        images = [validatedData.images]
      }
    }

    const finalUpdateData = {
      name: validatedData.name,
      brand: validatedData.brand,
      model: validatedData.model,
      year: parseInt(validatedData.year),
      seats: parseInt(validatedData.seats),
      pricePerDay: parseFloat(validatedData.pricePerDay),
      description: validatedData.description || null,
      internalDescription: validatedData.internalDescription || null,
      images: images,
      color: validatedData.color || null,
      plateNumber: validatedData.plateNumber || null,
      isAvailable: validatedData.isAvailable === 'true' || validatedData.isAvailable === true,
      storeId: validatedData.storeId
    }

    await prisma.vehicle.update({
      where: { id },
      data: finalUpdateData,
    })
  } catch (error) {
    console.error('更新车辆失败:', error)
    if (error instanceof Error) {
      throw new Error(`更新车辆失败: ${error.message}`)
    }
    throw new Error('更新车辆失败')
  }

  revalidatePath('/admin/vehicles')
  redirect('/admin/vehicles')
}

export async function deleteVehicle(id: string) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') {
    throw new Error('权限不足')
  }

  try {
    await prisma.vehicle.delete({
      where: { id },
    })

    revalidatePath('/admin/vehicles')
  } catch (error) {
    console.error('删除车辆失败:', error)
    throw new Error('删除车辆失败')
  }
}

export async function toggleVehicleAvailability(id: string) {
  const user = await getCurrentUser()
  if (!user || (user.role !== 'ADMIN' && user.role !== 'MANAGER')) {
    throw new Error('权限不足')
  }

  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      select: { isAvailable: true }
    })

    if (!vehicle) {
      throw new Error('车辆不存在')
    }

    await prisma.vehicle.update({
      where: { id },
      data: { isAvailable: !vehicle.isAvailable },
    })

    revalidatePath('/admin/vehicles')
  } catch (error) {
    console.error('切换车辆状态失败:', error)
    throw new Error('切换车辆状态失败')
  }
}

// 获取所有店面用于表单选择
export async function getStoresForSelect() {
  try {
    const stores = await prisma.store.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        city: true,
      },
      orderBy: {
        name: 'asc'
      }
    })
    
    return stores
  } catch (error) {
    console.error('获取店面列表失败:', error)
    return []
  }
} 