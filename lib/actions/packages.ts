'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

// 套餐筛选条件类型
export interface PackageFilters {
  category?: string
  tags?: string[]
  minPrice?: number
  maxPrice?: number
  isActive?: boolean
  isPublished?: boolean
  search?: string
}

// 套餐列表项数据类型
export interface PackageCardData {
  id: string
  name: string
  title?: string | null
  price: number
  originalPrice?: number | null
  description?: string | null
  thumbnail?: string | null
  images: string[]
  stock: number
  category?: string | null
  tags: string[]
  isActive: boolean
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
}

// 创建套餐的Schema
const CreatePackageSchema = z.object({
  name: z.string().min(1, '套餐名称不能为空'),
  title: z.string().optional(),
  price: z.number().positive('价格必须大于0'),
  originalPrice: z.number().optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  images: z.array(z.string()).default([]),
  thumbnail: z.string().optional(),
  stock: z.number().min(0, '库存不能为负数').default(0),
  maxStock: z.number().min(0, '最大库存不能为负数').default(0),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  isPublished: z.boolean().default(false),
  sortOrder: z.number().default(0),
  slug: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
})

// 更新套餐的Schema
const UpdatePackageSchema = CreatePackageSchema.extend({
  id: z.string().min(1, '套餐ID不能为空'),
})

// 获取套餐列表
export async function getPackageList(
  page: number = 1,
  pageSize: number = 12,
  filters: PackageFilters = {}
) {
  try {
    const offset = (page - 1) * pageSize
    
    // 构建查询条件
    const where: Prisma.PackageWhereInput = {
      AND: [
        filters.isActive !== undefined ? { isActive: filters.isActive } : {},
        filters.isPublished !== undefined ? { isPublished: filters.isPublished } : {},
        filters.category ? { category: filters.category } : {},
        filters.minPrice ? { price: { gte: filters.minPrice } } : {},
        filters.maxPrice ? { price: { lte: filters.maxPrice } } : {},
        filters.tags && filters.tags.length > 0 ? { tags: { hasSome: filters.tags } } : {},
        filters.search ? {
          OR: [
            { name: { contains: filters.search, mode: 'insensitive' } },
            { title: { contains: filters.search, mode: 'insensitive' } },
            { description: { contains: filters.search, mode: 'insensitive' } },
          ]
        } : {}
      ]
    }

    // 获取总数
    const total = await prisma.package.count({ where })
    
    // 获取套餐列表
    const packages = await prisma.package.findMany({
      where,
      skip: offset,
      take: pageSize,
      orderBy: [
        { sortOrder: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return {
      packages: packages as PackageCardData[],
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: page,
      pageSize
    }
  } catch (error) {
    console.error('获取套餐列表失败:', error)
    throw new Error('获取套餐列表失败')
  }
}

// 根据ID获取套餐详情
export async function getPackageById(id: string) {
  try {
    const package_ = await prisma.package.findUnique({
      where: { id },
      include: {
        orders: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    if (!package_) {
      throw new Error('套餐不存在')
    }

    return package_
  } catch (error) {
    console.error('获取套餐详情失败:', error)
    throw new Error('获取套餐详情失败')
  }
}

// 根据slug获取套餐详情
export async function getPackageBySlug(slug: string) {
  try {
    const package_ = await prisma.package.findUnique({
      where: { slug },
    })

    if (!package_) {
      throw new Error('套餐不存在')
    }

    return package_
  } catch (error) {
    console.error('获取套餐详情失败:', error)
    throw new Error('获取套餐详情失败')
  }
}

// 创建套餐 - 仅管理员可用
export async function createPackage(formData: FormData) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error('请先登录')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  })

  if (user?.role !== 'ADMIN') {
    throw new Error('权限不足')
  }

  try {
    const data = {
      name: formData.get('name') as string,
      title: formData.get('title') as string || undefined,
      price: parseFloat(formData.get('price') as string),
      originalPrice: formData.get('originalPrice') ? parseFloat(formData.get('originalPrice') as string) : undefined,
      description: formData.get('description') as string || undefined,
      content: formData.get('content') as string || undefined,
      images: formData.getAll('images') as string[],
      thumbnail: formData.get('thumbnail') as string || undefined,
      stock: parseInt(formData.get('stock') as string) || 0,
      maxStock: parseInt(formData.get('maxStock') as string) || 0,
      category: formData.get('category') as string || undefined,
      tags: formData.getAll('tags') as string[],
      isActive: formData.get('isActive') === 'true',
      isPublished: formData.get('isPublished') === 'true',
      sortOrder: parseInt(formData.get('sortOrder') as string) || 0,
      slug: formData.get('slug') as string || undefined,
      metaTitle: formData.get('metaTitle') as string || undefined,
      metaDescription: formData.get('metaDescription') as string || undefined,
    }

    const validatedData = CreatePackageSchema.parse(data)

    const package_ = await prisma.package.create({
      data: validatedData
    })

    revalidatePath('/admin/packages')
    return { success: true, package: package_ }
  } catch (error) {
    console.error('创建套餐失败:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: '创建套餐失败' }
  }
}

// 更新套餐 - 仅管理员可用
export async function updatePackage(formData: FormData) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error('请先登录')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  })

  if (user?.role !== 'ADMIN') {
    throw new Error('权限不足')
  }

  try {
    const data = {
      id: formData.get('id') as string,
      name: formData.get('name') as string,
      title: formData.get('title') as string || undefined,
      price: parseFloat(formData.get('price') as string),
      originalPrice: formData.get('originalPrice') ? parseFloat(formData.get('originalPrice') as string) : undefined,
      description: formData.get('description') as string || undefined,
      content: formData.get('content') as string || undefined,
      images: formData.getAll('images') as string[],
      thumbnail: formData.get('thumbnail') as string || undefined,
      stock: parseInt(formData.get('stock') as string) || 0,
      maxStock: parseInt(formData.get('maxStock') as string) || 0,
      category: formData.get('category') as string || undefined,
      tags: formData.getAll('tags') as string[],
      isActive: formData.get('isActive') === 'true',
      isPublished: formData.get('isPublished') === 'true',
      sortOrder: parseInt(formData.get('sortOrder') as string) || 0,
      slug: formData.get('slug') as string || undefined,
      metaTitle: formData.get('metaTitle') as string || undefined,
      metaDescription: formData.get('metaDescription') as string || undefined,
    }

    const validatedData = UpdatePackageSchema.parse(data)
    const { id, ...updateData } = validatedData

    const package_ = await prisma.package.update({
      where: { id },
      data: updateData
    })

    revalidatePath('/admin/packages')
    revalidatePath(`/admin/packages/${id}`)
    return { success: true, package: package_ }
  } catch (error) {
    console.error('更新套餐失败:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: '更新套餐失败' }
  }
}

// 删除套餐 - 仅管理员可用
export async function deletePackage(id: string) {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error('请先登录')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  })

  if (user?.role !== 'ADMIN') {
    throw new Error('权限不足')
  }

  try {
    // 检查是否有相关订单
    const orderCount = await prisma.order.count({
      where: { packageId: id }
    })

    if (orderCount > 0) {
      return { success: false, error: '该套餐有相关订单，无法删除' }
    }

    await prisma.package.delete({
      where: { id }
    })

    revalidatePath('/admin/packages')
    return { success: true }
  } catch (error) {
    console.error('删除套餐失败:', error)
    return { success: false, error: '删除套餐失败' }
  }
}

// 获取套餐分类列表
export async function getPackageCategories() {
  try {
    const categories = await prisma.package.findMany({
      select: { category: true },
      where: { 
        category: { not: null },
        isActive: true,
        isPublished: true
      },
      distinct: ['category']
    })

    return categories
      .map(item => item.category)
      .filter(Boolean)
      .sort()
  } catch (error) {
    console.error('获取套餐分类失败:', error)
    return []
  }
}

// 获取套餐标签列表
export async function getPackageTags() {
  try {
    const packages = await prisma.package.findMany({
      select: { tags: true },
      where: { 
        isActive: true,
        isPublished: true
      }
    })

    const allTags = packages.flatMap(pkg => pkg.tags)
    const uniqueTags = [...new Set(allTags)].sort()

    return uniqueTags
  } catch (error) {
    console.error('获取套餐标签失败:', error)
    return []
  }
}

// 更新套餐库存
export async function updatePackageStock(packageId: string, quantity: number) {
  try {
    const package_ = await prisma.package.findUnique({
      where: { id: packageId },
      select: { stock: true }
    })

    if (!package_) {
      throw new Error('套餐不存在')
    }

    if (package_.stock < quantity) {
      throw new Error('库存不足')
    }

    await prisma.package.update({
      where: { id: packageId },
      data: { stock: package_.stock - quantity }
    })

    return { success: true }
  } catch (error) {
    console.error('更新套餐库存失败:', error)
    throw new Error('更新套餐库存失败')
  }
}

// 获取热门套餐（按订单数量排序）
export async function getPopularPackages(limit: number = 8) {
  try {
    const packages = await prisma.package.findMany({
      where: {
        isActive: true,
        isPublished: true,
        stock: { gt: 0 }
      },
      include: {
        _count: {
          select: { orders: true }
        }
      },
      orderBy: [
        { orders: { _count: 'desc' } },
        { sortOrder: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit
    })

    return packages.map(pkg => ({
      ...pkg,
      orderCount: pkg._count.orders
    }))
  } catch (error) {
    console.error('获取热门套餐失败:', error)
    return []
  }
}