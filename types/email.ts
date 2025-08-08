// 邮件发送参数类型
export interface EmailParams {
  to: string
  userName: string
  orderNumber: string
  status: string
  vehicleName?: string
  packageName?: string
  startDate: Date | string
  endDate: Date | string
  storeName: string
  orderId: string
  isUserCancelled?: boolean
  language?: string // 新增语言参数
}

// 邮件发送结果类型
export interface EmailResult {
  success: boolean
  data?: any
  error?: any
}

// 订单状态邮件配置类型
export interface OrderStatusEmailConfig {
  subject: string
  message: string
}

// 邮件模板参数类型
export interface EmailTemplateParams {
  userName: string
  orderNumber: string
  status: string
  content: string
  storeName: string
  orderId: string
  vehicleName: string
  startDate: Date | string
  endDate: Date | string
}

// 多语言邮件模板接口
export interface MultiLanguageEmailTemplate {
  status: string
  language: string
  subject: string
  content: string
  emoji?: string
}

// 支持的语言类型
export type SupportedLanguage = 'en' | 'ja' | 'zh'

// 语言配置
export const LANGUAGE_CONFIG = {
  en: {
    name: 'English',
    flag: '🇺🇸',
    direction: 'ltr'
  },
  ja: {
    name: '日本語',
    flag: '🇯🇵', 
    direction: 'ltr'
  },
  zh: {
    name: '中文',
    flag: '🇨🇳',
    direction: 'ltr'
  }
} as const
