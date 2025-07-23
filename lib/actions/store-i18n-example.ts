import { prisma } from '@/lib/prisma'
import { DatabaseI18n, type SupportedLocale, type I18nText } from '@/lib/i18n-db'

/**
 * 店面多语言操作示例
 * 展示如何使用JSON方案进行数据库i18n操作
 */

// 创建多语言店面
export async function createMultilingualStore(storeData: {
  name: I18nText
  description?: I18nText
  address: string
  city: string
  phone: string
  email?: string
}) {
  const store = await prisma.store.create({
    data: {
      name: storeData.name,
      description: storeData.description || {},
      address: storeData.address,
      city: storeData.city,
      phone: storeData.phone,
      email: storeData.email,
    }
  })
  
  return store
}

// 获取指定语言的店面列表
export async function getStoresWithLocale(locale: SupportedLocale = 'zh') {
  const stores = await prisma.store.findMany({
    where: {
      isActive: true
    },
    orderBy: DatabaseI18n.createI18nOrderBy(locale, 'name')
  })

  // 处理多语言字段
  return stores.map(store => ({
    ...store,
    name: DatabaseI18n.getText(store.name, locale),
    description: DatabaseI18n.getText(store.description, locale)
  }))
}

// 搜索多语言店面
export async function searchStores(searchTerm: string, locale: SupportedLocale = 'zh') {
  const stores = await prisma.store.findMany({
    where: {
      AND: [
        { isActive: true },
        {
          OR: [
            DatabaseI18n.createI18nSearchCondition(locale, 'name', searchTerm),
            DatabaseI18n.createI18nSearchCondition(locale, 'description', searchTerm)
          ]
        }
      ]
    }
  })

  return stores.map(store => ({
    ...store,
    name: DatabaseI18n.getText(store.name, locale),
    description: DatabaseI18n.getText(store.description, locale)
  }))
}

// 更新店面的特定语言内容
export async function updateStoreTranslation(
  storeId: string,
  locale: SupportedLocale,
  updates: {
    name?: string
    description?: string
  }
) {
  const currentStore = await prisma.store.findUnique({
    where: { id: storeId }
  })

  if (!currentStore) {
    throw new Error('Store not found')
  }

  const updateData: any = {}

  if (updates.name) {
    updateData.name = DatabaseI18n.updateI18nData(currentStore.name, locale, updates.name)
  }

  if (updates.description) {
    updateData.description = DatabaseI18n.updateI18nData(
      currentStore.description, 
      locale, 
      updates.description
    )
  }

  return await prisma.store.update({
    where: { id: storeId },
    data: updateData
  })
}

/**
 * 车辆多语言操作示例
 */

// 创建多语言车辆
export async function createMultilingualVehicle(vehicleData: {
  name: I18nText
  description?: I18nText
  internalDescription?: I18nText
  brand: string
  model: string
  year: number
  seats: number
  pricePerDay: number
  storeId: string
}) {
  const vehicle = await prisma.vehicle.create({
    data: {
      name: vehicleData.name,
      description: vehicleData.description || {},
      internalDescription: vehicleData.internalDescription || {},
      brand: vehicleData.brand,
      model: vehicleData.model,
      year: vehicleData.year,
      seats: vehicleData.seats,
      pricePerDay: vehicleData.pricePerDay,
      storeId: vehicleData.storeId,
    }
  })
  
  return vehicle
}

// 获取指定语言的车辆列表
export async function getVehiclesWithLocale(
  locale: SupportedLocale = 'zh',
  storeId?: string
) {
  const vehicles = await prisma.vehicle.findMany({
    where: {
      isAvailable: true,
      ...(storeId && { storeId })
    },
    include: {
      store: true
    },
    orderBy: DatabaseI18n.createI18nOrderBy(locale, 'name')
  })

  return vehicles.map(vehicle => ({
    ...vehicle,
    name: DatabaseI18n.getText(vehicle.name, locale),
    description: DatabaseI18n.getText(vehicle.description, locale),
    internalDescription: DatabaseI18n.getText(vehicle.internalDescription, locale),
    store: {
      ...vehicle.store,
      name: DatabaseI18n.getText(vehicle.store.name, locale),
      description: DatabaseI18n.getText(vehicle.store.description, locale)
    }
  }))
}

/**
 * 新闻多语言操作示例
 */

// 创建多语言新闻
export async function createMultilingualNews(newsData: {
  title: I18nText
  content: I18nText
  summary?: I18nText
  metaTitle?: I18nText
  metaDescription?: I18nText
  author?: string
  category?: string
  tags?: string[]
}) {
  const news = await prisma.news.create({
    data: {
      title: newsData.title,
      content: newsData.content,
      summary: newsData.summary || {},
      metaTitle: newsData.metaTitle || {},
      metaDescription: newsData.metaDescription || {},
      author: newsData.author,
      category: newsData.category,
      tags: newsData.tags || [],
    }
  })
  
  return news
}

// 获取已发布的多语言新闻
export async function getPublishedNewsWithLocale(locale: SupportedLocale = 'zh') {
  const news = await prisma.news.findMany({
    where: {
      isPublished: true,
      publishedAt: {
        lte: new Date()
      }
    },
    orderBy: {
      publishedAt: 'desc'
    }
  })

  return news.map(article => ({
    ...article,
    title: DatabaseI18n.getText(article.title, locale),
    content: DatabaseI18n.getText(article.content, locale),
    summary: DatabaseI18n.getText(article.summary, locale),
    metaTitle: DatabaseI18n.getText(article.metaTitle, locale),
    metaDescription: DatabaseI18n.getText(article.metaDescription, locale)
  }))
}

/**
 * 套餐多语言操作示例
 */

// 获取推荐套餐（多语言）
export async function getFeaturedPackagesWithLocale(locale: SupportedLocale = 'zh') {
  const packages = await prisma.package.findMany({
    where: {
      isActive: true,
      isFeatured: true,
      stock: {
        gt: 0
      }
    },
    orderBy: DatabaseI18n.createI18nOrderBy(locale, 'name')
  })

  return packages.map(pkg => ({
    ...pkg,
    name: DatabaseI18n.getText(pkg.name, locale),
    description: DatabaseI18n.getText(pkg.description, locale),
    content: DatabaseI18n.getText(pkg.content, locale)
  }))
}

/**
 * 通知多语言操作示例
 */

// 创建多语言通知
export async function createMultilingualNotification(notificationData: {
  userId: string
  title: I18nText
  message: I18nText
  type: 'ORDER' | 'SYSTEM' | 'PROMOTION' | 'MAINTENANCE'
  relatedOrderId?: string
}) {
  const notification = await prisma.notification.create({
    data: {
      userId: notificationData.userId,
      title: notificationData.title,
      message: notificationData.message,
      type: notificationData.type,
      relatedOrderId: notificationData.relatedOrderId,
    }
  })
  
  return notification
}

// 获取用户的多语言通知
export async function getUserNotificationsWithLocale(
  userId: string,
  locale: SupportedLocale = 'zh'
) {
  const notifications = await prisma.notification.findMany({
    where: {
      userId
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 50
  })

  return notifications.map(notification => ({
    ...notification,
    title: DatabaseI18n.getText(notification.title, locale),
    message: DatabaseI18n.getText(notification.message, locale)
  }))
}

/**
 * 数据验证和迁移工具
 */

// 验证多语言数据完整性
export async function validateI18nDataIntegrity() {
  const issues: string[] = []

  // 检查店面数据
  const stores = await prisma.store.findMany()
  stores.forEach(store => {
    if (!DatabaseI18n.validateI18nData(store.name)) {
      issues.push(`Store ${store.id}: name missing required translations`)
    }
  })

  // 检查车辆数据
  const vehicles = await prisma.vehicle.findMany()
  vehicles.forEach(vehicle => {
    if (!DatabaseI18n.validateI18nData(vehicle.name)) {
      issues.push(`Vehicle ${vehicle.id}: name missing required translations`)
    }
  })

  // 检查新闻数据
  const news = await prisma.news.findMany()
  news.forEach(article => {
    if (!DatabaseI18n.validateI18nData(article.title)) {
      issues.push(`News ${article.id}: title missing required translations`)
    }
    if (!DatabaseI18n.validateI18nData(article.content)) {
      issues.push(`News ${article.id}: content missing required translations`)
    }
  })

  return issues
}

// 批量更新缺失的翻译（使用机器翻译或默认值）
export async function fillMissingTranslations() {
  // 这里可以集成机器翻译API，如Google Translate、DeepL等
  // 或者设置默认的占位文本
  
  const results = {
    updated: 0,
    failed: 0
  }

  try {
    // 示例：为所有缺少英文翻译的店面添加默认翻译
    const stores = await prisma.store.findMany()
    
    for (const store of stores) {
      const missingLocales = DatabaseI18n.getMissingLocales(store.name, ['en', 'ja'])
      
      if (missingLocales.length > 0) {
        const updatedName = { ...store.name }
        
        missingLocales.forEach(locale => {
          // 这里应该调用翻译API，现在使用占位符
          updatedName[locale] = `[${locale.toUpperCase()}] ${DatabaseI18n.getText(store.name, 'zh')}`
        })
        
        await prisma.store.update({
          where: { id: store.id },
          data: { name: updatedName }
        })
        
        results.updated++
      }
    }
  } catch (error) {
    results.failed++
    console.error('Error filling missing translations:', error)
  }

  return results
}