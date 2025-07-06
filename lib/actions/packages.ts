'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export interface Package {
  id: string
  name: string
  description: string | null
  content: string | null
  images: string[]
  price: number
  stock: number
  isActive: boolean
  isFeatured: boolean
  createdAt: Date
  updatedAt: Date
}

// 获取推荐套餐
export async function getFeaturedPackages(): Promise<Package[]> {
  try {
    const packages = await prisma.package.findMany({
      where: {
        isActive: true,
        isFeatured: true,
        stock: {
          gt: 0
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 8
    })
    
    return packages
  } catch (error) {
    console.error('获取推荐套餐失败:', error)
    return []
  }
}

// 获取所有套餐
export async function getAllPackages(params?: {
  minPrice?: number
  maxPrice?: number
  search?: string
}): Promise<Package[]> {
  try {
    const where: any = {
      isActive: true,
      stock: {
        gt: 0
      }
    }

    if (params?.minPrice !== undefined) {
      where.price = { ...where.price, gte: params.minPrice }
    }

    if (params?.maxPrice !== undefined) {
      where.price = { ...where.price, lte: params.maxPrice }
    }

    if (params?.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } }
      ]
    }

    const packages = await prisma.package.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return packages
  } catch (error) {
    console.error('获取套餐列表失败:', error)
    return []
  }
}

// 获取单个套餐详情
export async function getPackageById(id: string): Promise<Package | null> {
  try {
    const packageData = await prisma.package.findUnique({
      where: { id }
    })
    
    return packageData
  } catch (error) {
    console.error('获取套餐详情失败:', error)
    return null
  }
}

// 创建套餐
export async function createPackage(formData: FormData) {
  try {
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const content = formData.get('content') as string
    const price = parseFloat(formData.get('price') as string)
    const stock = parseInt(formData.get('stock') as string)
    const isFeatured = formData.get('isFeatured') === 'on'
    const images = formData.getAll('images') as string[]

    await prisma.package.create({
      data: {
        name,
        description,
        content,
        price,
        stock,
        isFeatured,
        images: images.filter(img => img.trim() !== '')
      }
    })

    revalidatePath('/admin/packages')
    revalidatePath('/')
  } catch (error) {
    console.error('创建套餐失败:', error)
    throw new Error('创建套餐失败')
  }
  
  redirect('/admin/packages')
}

// 更新套餐
export async function updatePackage(id: string, formData: FormData) {
  try {
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const content = formData.get('content') as string
    const price = parseFloat(formData.get('price') as string)
    const stock = parseInt(formData.get('stock') as string)
    const isFeatured = formData.get('isFeatured') === 'on'
    const images = formData.getAll('images') as string[]

    await prisma.package.update({
      where: { id },
      data: {
        name,
        description,
        content,
        price,
        stock,
        isFeatured,
        images: images.filter(img => img.trim() !== '')
      }
    })

    revalidatePath('/admin/packages')
    revalidatePath('/')
  } catch (error) {
    console.error('更新套餐失败:', error)
    throw new Error('更新套餐失败')
  }
}

// 删除套餐
export async function deletePackage(id: string) {
  try {
    await prisma.package.delete({
      where: { id }
    })

    revalidatePath('/admin/packages')
    revalidatePath('/')
  } catch (error) {
    console.error('删除套餐失败:', error)
    throw new Error('删除套餐失败')
  }
}

// 切换套餐状态
export async function togglePackageStatus(id: string) {
  try {
    const packageData = await prisma.package.findUnique({
      where: { id },
      select: { isActive: true }
    })

    if (!packageData) {
      throw new Error('套餐不存在')
    }

    await prisma.package.update({
      where: { id },
      data: {
        isActive: !packageData.isActive
      }
    })

    revalidatePath('/admin/packages')
    revalidatePath('/')
  } catch (error) {
    console.error('切换套餐状态失败:', error)
    throw new Error('切换套餐状态失败')
  }
}

// 购买套餐（库存减一）
export async function purchasePackage(packageId: string) {
  try {
    const packageData = await prisma.package.findUnique({
      where: { id: packageId },
      select: { stock: true }
    })

    if (!packageData) {
      throw new Error('套餐不存在')
    }

    if (packageData.stock <= 0) {
      throw new Error('库存不足')
    }

    await prisma.package.update({
      where: { id: packageId },
      data: {
        stock: packageData.stock - 1
      }
    })

    revalidatePath('/')
  } catch (error) {
    console.error('购买套餐失败:', error)
    throw new Error('购买套餐失败')
  }
}