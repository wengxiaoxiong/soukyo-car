'use server'

import { prisma } from '@/lib/prisma'

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