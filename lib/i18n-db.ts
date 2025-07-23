import { type Locale } from '@/i18n'

// 支持的语言类型
export type SupportedLocale = 'zh' | 'en' | 'ja'

// 多语言文本类型
export type I18nText = {
  [K in SupportedLocale]?: string
}

// 多语言内容类型（用于长文本）
export type I18nContent = {
  [K in SupportedLocale]?: string
}

/**
 * 数据库i18n工具类
 * 用于处理JSON格式的多语言数据
 */
export class DatabaseI18n {
  /**
   * 从多语言JSON对象中获取指定语言的文本
   * @param i18nData - 多语言JSON数据
   * @param locale - 目标语言
   * @param fallbackLocale - 备用语言，默认为'zh'
   * @returns 指定语言的文本，如果不存在则返回备用语言的文本
   */
  static getText(
    i18nData: any,
    locale: SupportedLocale,
    fallbackLocale: SupportedLocale = 'zh'
  ): string {
    if (!i18nData || typeof i18nData !== 'object') {
      return ''
    }

    // 首先尝试获取目标语言的文本
    if (i18nData[locale]) {
      return i18nData[locale]
    }

    // 如果目标语言不存在，尝试备用语言
    if (i18nData[fallbackLocale]) {
      return i18nData[fallbackLocale]
    }

    // 如果备用语言也不存在，返回第一个可用的语言
    const availableLocales = Object.keys(i18nData) as SupportedLocale[]
    if (availableLocales.length > 0) {
      return i18nData[availableLocales[0]] || ''
    }

    return ''
  }

  /**
   * 创建多语言JSON对象
   * @param translations - 各语言的翻译对象
   * @returns 多语言JSON对象
   */
  static createI18nData(translations: Partial<I18nText>): I18nText {
    return {
      zh: translations.zh || '',
      en: translations.en || '',
      ja: translations.ja || ''
    }
  }

  /**
   * 更新多语言JSON对象中的特定语言
   * @param existingData - 现有的多语言数据
   * @param locale - 要更新的语言
   * @param text - 新的文本内容
   * @returns 更新后的多语言JSON对象
   */
  static updateI18nData(
    existingData: any,
    locale: SupportedLocale,
    text: string
  ): I18nText {
    const currentData = existingData || {}
    return {
      ...currentData,
      [locale]: text
    }
  }

  /**
   * 验证多语言数据是否完整
   * @param i18nData - 多语言JSON数据
   * @param requiredLocales - 必需的语言列表
   * @returns 是否所有必需语言都有内容
   */
  static validateI18nData(
    i18nData: any,
    requiredLocales: SupportedLocale[] = ['zh']
  ): boolean {
    if (!i18nData || typeof i18nData !== 'object') {
      return false
    }

    return requiredLocales.every(locale => 
      i18nData[locale] && typeof i18nData[locale] === 'string' && i18nData[locale].trim() !== ''
    )
  }

  /**
   * 获取多语言数据中缺少的语言
   * @param i18nData - 多语言JSON数据
   * @param requiredLocales - 必需的语言列表
   * @returns 缺少的语言列表
   */
  static getMissingLocales(
    i18nData: any,
    requiredLocales: SupportedLocale[] = ['zh', 'en', 'ja']
  ): SupportedLocale[] {
    if (!i18nData || typeof i18nData !== 'object') {
      return requiredLocales
    }

    return requiredLocales.filter(locale => 
      !i18nData[locale] || typeof i18nData[locale] !== 'string' || i18nData[locale].trim() === ''
    )
  }

  /**
   * 为Prisma查询添加多语言排序
   * @param locale - 排序使用的语言
   * @param field - 要排序的字段名
   * @param order - 排序方向
   * @returns Prisma排序对象
   */
  static createI18nOrderBy(
    locale: SupportedLocale,
    field: string,
    order: 'asc' | 'desc' = 'asc'
  ) {
    return {
      [field]: {
        path: [locale],
        sort: order
      }
    }
  }

  /**
   * 为Prisma查询添加多语言搜索条件
   * @param locale - 搜索使用的语言
   * @param field - 要搜索的字段名
   * @param searchTerm - 搜索词
   * @returns Prisma查询条件
   */
  static createI18nSearchCondition(
    locale: SupportedLocale,
    field: string,
    searchTerm: string
  ) {
    return {
      [field]: {
        path: [locale],
        string_contains: searchTerm
      }
    }
  }

  /**
   * 批量处理多语言数据
   * @param items - 包含多语言字段的项目列表
   * @param locale - 目标语言
   * @param i18nFields - 需要处理的多语言字段列表
   * @returns 处理后的项目列表
   */
  static processI18nItems<T extends Record<string, any>>(
    items: T[],
    locale: SupportedLocale,
    i18nFields: string[]
  ): T[] {
    return items.map(item => {
      const processedItem = { ...item }
      
      i18nFields.forEach(field => {
        if (processedItem[field]) {
          processedItem[field] = this.getText(processedItem[field], locale)
        }
      })
      
      return processedItem
    })
  }
}

/**
 * React Hook for database i18n
 * 用于在组件中方便地处理数据库多语言内容
 */
export function useDbI18n(locale?: string) {
  const currentLocale = (locale || 'zh') as SupportedLocale

  const getText = (i18nData: any, fallbackLocale?: SupportedLocale) => {
    return DatabaseI18n.getText(i18nData, currentLocale, fallbackLocale)
  }

  const createI18nData = (translations: Partial<I18nText>) => {
    return DatabaseI18n.createI18nData(translations)
  }

  const updateI18nData = (existingData: any, text: string) => {
    return DatabaseI18n.updateI18nData(existingData, currentLocale, text)
  }

  return {
    getText,
    createI18nData,
    updateI18nData,
    locale: currentLocale
  }
}

// 类型定义导出
export type { I18nText, I18nContent, SupportedLocale }