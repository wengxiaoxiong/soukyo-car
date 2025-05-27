'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function createStore(formData: FormData) {
  const user = await getCurrentUser()
  if (!user || (user.role !== 'ADMIN' && user.role !== 'MANAGER')) {
    throw new Error('权限不足')
  }

  const name = formData.get('name') as string
  const address = formData.get('address') as string
  const city = formData.get('city') as string
  const state = formData.get('state') as string
  const zipCode = formData.get('zipCode') as string
  const phone = formData.get('phone') as string
  const email = formData.get('email') as string
  const description = formData.get('description') as string
  const image = formData.get('image') as string
  const latitude = formData.get('latitude') as string
  const longitude = formData.get('longitude') as string
  const openingHours = formData.get('openingHours') as string

  try {
    await prisma.store.create({
      data: {
        name,
        address,
        city,
        state: state || null,
        zipCode: zipCode || null,
        phone,
        email: email || null,
        description: description || null,
        image: image || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        openingHours: openingHours ? JSON.parse(openingHours) : null,
      },
    })

    revalidatePath('/admin/stores')
    redirect('/admin/stores')
  } catch (error) {
    console.error('创建店面失败:', error)
    throw new Error('创建店面失败')
  }
}

export async function updateStore(id: string, formData: FormData) {
  const user = await getCurrentUser()
  if (!user || (user.role !== 'ADMIN' && user.role !== 'MANAGER')) {
    throw new Error('权限不足')
  }

  const name = formData.get('name') as string
  const address = formData.get('address') as string
  const city = formData.get('city') as string
  const state = formData.get('state') as string
  const zipCode = formData.get('zipCode') as string
  const phone = formData.get('phone') as string
  const email = formData.get('email') as string
  const description = formData.get('description') as string
  const image = formData.get('image') as string
  const latitude = formData.get('latitude') as string
  const longitude = formData.get('longitude') as string
  const openingHours = formData.get('openingHours') as string
  const isActive = formData.get('isActive') === 'true'

  try {
    await prisma.store.update({
      where: { id },
      data: {
        name,
        address,
        city,
        state: state || null,
        zipCode: zipCode || null,
        phone,
        email: email || null,
        description: description || null,
        image: image || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        openingHours: openingHours ? JSON.parse(openingHours) : null,
        isActive,
      },
    })

    revalidatePath('/admin/stores')
    redirect('/admin/stores')
  } catch (error) {
    console.error('更新店面失败:', error)
    throw new Error('更新店面失败')
  }
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