'use server'

import { prisma } from '@/lib/prisma'
import { OpeningHours } from '@/lib/utils/store'

export interface StoreWithOpeningHours {
  id: string
  name: string
  address: string
  phone: string
  image: string | null
  googleMap: string | null
  openingHours: OpeningHours | null
  description: string | null
  latitude: number | null
  longitude: number | null
  isActive: boolean
}

export async function getActiveStores(): Promise<StoreWithOpeningHours[]> {
  try {
    const stores = await prisma.store.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        address: true,
        phone: true,
        image: true,
        googleMap: true,
        openingHours: true,
        description: true,
        latitude: true,
        longitude: true,
        isActive: true,
      },
      orderBy: { createdAt: 'asc' }
    })

    return stores.map(store => ({
      ...store,
      openingHours: store.openingHours as OpeningHours | null
    }))
  } catch (error) {
    console.error('获取店面数据失败:', error)
    return []
  }
} 