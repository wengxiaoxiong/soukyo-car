'use server'

import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

export interface FeaturedCar {
  id: string
  name: string
  type: string
  price: string
  image: string
  location: string
  seats: string
  transmission: string
}

export async function getFeaturedCars(): Promise<FeaturedCar[]> {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: {
        isAvailable: true,
      },
      include: {
        store: {
          select: {
            name: true,
            city: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 3, // 只取前3辆车作为推荐
  })

    return vehicles.map(vehicle => ({
      id: vehicle.id,
      name: vehicle.name,
      type: `${vehicle.brand} ${vehicle.model}`,
      price: `￥${vehicle.pricePerDay}`,
      image: vehicle.images[0] || 'https://ai-public.mastergo.com/ai/img_res/e8ecc253a5e6100ab260268be804cff7.jpg',
      location: `${vehicle.store.city}可取还`,
      seats: `${vehicle.seats}座`,
      transmission: '自动档'
    }))
  } catch (error) {
    console.error('获取推荐车辆失败:', error)
    // 如果数据库查询失败，返回空数组
    return []
  }
}

export interface VehicleListItem {
  id: string
  name: string
  brand: string
  model: string
  year: number
  seats: number
  pricePerDay: number
  image: string
  color?: string | null
  isAvailable: boolean
  store: {
    name: string
    city: string
  }
}

export interface VehicleListResult {
  vehicles: VehicleListItem[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface VehicleFilters {
  brand?: string
  minPrice?: number
  maxPrice?: number
  seats?: number
  city?: string
  isAvailable?: boolean
}

export async function getVehicleList(
  page: number = 1,
  pageSize: number = 12,
  filters: VehicleFilters = {}
): Promise<VehicleListResult> {
  try {
    const skip = (page - 1) * pageSize
    
    // 构建查询条件
    const where: Prisma.VehicleWhereInput = {}
    
    if (filters.brand) {
      where.brand = {
        contains: filters.brand,
        mode: 'insensitive'
      }
    }
    
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.pricePerDay = {}
      if (filters.minPrice !== undefined) {
        where.pricePerDay.gte = filters.minPrice
      }
      if (filters.maxPrice !== undefined) {
        where.pricePerDay.lte = filters.maxPrice
      }
    }
    
    if (filters.seats) {
      where.seats = filters.seats
    }
    
    if (filters.city) {
      where.store = {
        city: {
          contains: filters.city,
          mode: 'insensitive'
        }
      }
    }
    
    if (filters.isAvailable !== undefined) {
      where.isAvailable = filters.isAvailable
    }

    // 获取车辆列表和总数
    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        include: {
          store: {
            select: {
              name: true,
              city: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: pageSize,
      }),
      prisma.vehicle.count({ where })
    ])

    const totalPages = Math.ceil(total / pageSize)

    return {
      vehicles: vehicles.map(vehicle => ({
        id: vehicle.id,
        name: vehicle.name,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        seats: vehicle.seats,
        pricePerDay: vehicle.pricePerDay,
        image: vehicle.images[0] || 'https://ai-public.mastergo.com/ai/img_res/e8ecc253a5e6100ab260268be804cff7.jpg',
        color: vehicle.color,
        isAvailable: vehicle.isAvailable,
        store: {
          name: vehicle.store.name,
          city: vehicle.store.city
        }
      })),
      total,
      page,
      pageSize,
      totalPages
    }
  } catch (error) {
    console.error('获取车辆列表失败:', error)
    return {
      vehicles: [],
      total: 0,
      page,
      pageSize,
      totalPages: 0
    }
  }
}

// 获取所有可用的品牌
export async function getAvailableBrands(): Promise<string[]> {
  try {
    const brands = await prisma.vehicle.findMany({
      select: {
        brand: true,
      },
      distinct: ['brand'],
      orderBy: {
        brand: 'asc',
      }
    })
    
    return brands.map(b => b.brand)
  } catch (error) {
    console.error('获取品牌列表失败:', error)
    return []
  }
}

// 获取所有可用的城市
export async function getAvailableCities(): Promise<string[]> {
  try {
    const cities = await prisma.store.findMany({
      select: {
        city: true,
      },
      distinct: ['city'],
      orderBy: {
        city: 'asc',
      }
    })
    
    return cities.map(c => c.city)
  } catch (error) {
    console.error('获取城市列表失败:', error)
    return []
  }
} 