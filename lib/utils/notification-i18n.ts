export type SupportedLanguage = 'en' | 'ja' | 'zh'

export function getLocaleForLanguage(language: string | null | undefined): string {
  switch (language) {
    case 'ja':
      return 'ja-JP'
    case 'zh':
      return 'zh-CN'
    case 'en':
    default:
      return 'en-US'
  }
}

export function formatDateParts(date: Date, language: SupportedLanguage) {
  const locale = getLocaleForLanguage(language)
  const dateText = new Date(date).toLocaleDateString(locale)
  const timeText = new Date(date).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
  return { dateText, timeText }
}

type NotificationKey = 'order_confirmed' | 'order_cancelled' | 'payment_success' | 'payment_failed' | 'status_updated'

interface NotificationContext {
  orderNumber: string
  vehicleName?: string
  storeName?: string
  dateText?: string
  timeText?: string
  status?: string // raw status code for status_updated
}

export function buildOrderNotification(language: SupportedLanguage, key: NotificationKey, ctx: NotificationContext) {
  const statusMap: Record<SupportedLanguage, Record<string, string>> = {
    en: {
      PENDING: 'Pending',
      CONFIRMED: 'Confirmed',
      ONGOING: 'Ongoing',
      COMPLETED: 'Completed',
      CANCELLED: 'Cancelled',
      REFUNDED: 'Refunded',
    },
    ja: {
      PENDING: '保留中',
      CONFIRMED: '確認済み',
      ONGOING: '進行中',
      COMPLETED: '完了',
      CANCELLED: 'キャンセル',
      REFUNDED: '返金済み',
    },
    zh: {
      PENDING: '待确认',
      CONFIRMED: '已确认',
      ONGOING: '进行中',
      COMPLETED: '已完成',
      CANCELLED: '已取消',
      REFUNDED: '已退款',
    },
  }

  const s = (code?: string) => (code ? (statusMap[language][code] || code) : '')

  if (language === 'en') {
    switch (key) {
      case 'order_confirmed':
        return {
          title: 'Order Confirmed 🚗',
          message: `Your order #${ctx.orderNumber} has been confirmed. Vehicle: ${ctx.vehicleName ?? 'N/A'}. ${ctx.dateText} ${ctx.timeText} pickup at ${ctx.storeName ?? 'store'}.`,
        }
      case 'order_cancelled':
        return {
          title: 'Order Cancelled 🗑️',
          message: `Your order #${ctx.orderNumber} has been cancelled. Vehicle: ${ctx.vehicleName ?? 'N/A'}. Originally ${ctx.dateText} ${ctx.timeText} pickup at ${ctx.storeName ?? 'store'}.`,
        }
      case 'payment_success':
        return {
          title: 'Payment Successful 💳',
          message: `Your payment for order #${ctx.orderNumber} succeeded. Vehicle: ${ctx.vehicleName ?? 'N/A'}. Order placed and awaiting merchant confirmation. We'll notify you once it's confirmed.`,
        }
      case 'payment_failed':
        return {
          title: 'Payment Failed ⚠️',
          message: `Your order #${ctx.orderNumber} payment failed. Please try again.`,
        }
      case 'status_updated':
        return {
          title: `Order Status Updated - ${s(ctx.status)}`,
          message: `Your order #${ctx.orderNumber} status has been updated to ${s(ctx.status)}. Vehicle: ${ctx.vehicleName ?? 'N/A'}. ${ctx.dateText} ${ctx.timeText} pickup at ${ctx.storeName ?? 'store'}.`,
        }
    }
  }

  if (language === 'ja') {
    switch (key) {
      case 'order_confirmed':
        return {
          title: '注文が確認されました 🚗',
          message: `ご注文 #${ctx.orderNumber} は確認されました。車種：${ctx.vehicleName ?? '指定なし'}。${ctx.dateText} ${ctx.timeText} に ${ctx.storeName ?? '店舗'} で受け取り。`,
        }
      case 'order_cancelled':
        return {
          title: '注文がキャンセルされました 🗑️',
          message: `ご注文 #${ctx.orderNumber} はキャンセルされました。車種：${ctx.vehicleName ?? '指定なし'}。元の受取時間：${ctx.dateText} ${ctx.timeText}、場所：${ctx.storeName ?? '店舗'}。`,
        }
      case 'payment_success':
        return {
          title: 'お支払いが成功しました 💳',
          message: `ご注文 #${ctx.orderNumber} のお支払いが完了しました。車種：${ctx.vehicleName ?? '指定なし'}。注文は作成済みで、現在は店舗の確認待ちです。確認後にお知らせします。`,
        }
      case 'payment_failed':
        return {
          title: 'お支払いに失敗しました ⚠️',
          message: `ご注文 #${ctx.orderNumber} のお支払いに失敗しました。もう一度お試しください。`,
        }
      case 'status_updated':
        return {
          title: `注文状況が更新されました - ${s(ctx.status)}`,
          message: `ご注文 #${ctx.orderNumber} の状況は ${s(ctx.status)} に更新されました。車種：${ctx.vehicleName ?? '指定なし'}。${ctx.dateText} ${ctx.timeText} に ${ctx.storeName ?? '店舗'} で受け取り。`,
        }
    }
  }

  // zh (默认中文)
  switch (key) {
    case 'order_confirmed':
      return {
        title: '订单已被确认 🚗',
        message: `您的订单 #${ctx.orderNumber} 已被确认，车型：${ctx.vehicleName ?? '未指定'}，${ctx.dateText} ${ctx.timeText} 在${ctx.storeName ?? '门店'}取车。`,
      }
    case 'order_cancelled':
      return {
        title: '订单已取消 🗑️',
        message: `您的订单 #${ctx.orderNumber} 已取消，车型：${ctx.vehicleName ?? '未指定'}，原定 ${ctx.dateText} ${ctx.timeText} 在${ctx.storeName ?? '门店'}取车。`,
      }
    case 'payment_success':
      return {
        title: '支付成功 💳',
        message: `您的订单 #${ctx.orderNumber} 支付成功，车型：${ctx.vehicleName ?? '未指定'}。订单已下单，等待商家确认。确认后我们会再次通知您。`,
      }
    case 'payment_failed':
      return {
        title: '支付失败 ⚠️',
        message: `您的订单 #${ctx.orderNumber} 支付失败，请重新尝试支付。`,
      }
    case 'status_updated':
      return {
        title: `订单状态更新 - ${s(ctx.status)}`,
        message: `您的订单 #${ctx.orderNumber} 状态已更新为 ${s(ctx.status)}，车型：${ctx.vehicleName ?? '未指定'}，${ctx.dateText} ${ctx.timeText} 在${ctx.storeName ?? '门店'}取车。`,
      }
  }
}


