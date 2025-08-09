import { Resend } from 'resend'
import type { EmailParams, EmailResult, EmailTemplateParams } from '@/types/email'
import { prisma } from '@/lib/prisma'

// 邮件服务类
export class EmailService {
  private resend: Resend

  constructor() {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error('RESEND_API_KEY 环境变量未设置')
    }
    this.resend = new Resend(apiKey)
  }

  // 发送订单状态变更邮件（使用队列）
  async sendOrderStatusEmail(params: EmailParams & { isUserCancelled?: boolean; userLanguage?: string }): Promise<EmailResult> {
    try {
      // 延迟导入队列，避免循环依赖
      const { addEmailToQueue } = await import('./emailQueue')
      const jobId = await addEmailToQueue(params)
      console.log(`邮件已添加到队列，任务ID: ${jobId}`)
      return { success: true, data: { jobId } }
    } catch (error) {
      console.error('添加邮件到队列失败:', error)
      return { success: false, error }
    }
  }

  // 直接发送邮件（队列内部使用）
  async sendEmailDirectly(params: EmailParams & { isUserCancelled?: boolean; userLanguage?: string }): Promise<EmailResult> {
    const {
      to,
      userName,
      orderNumber,
      status,
      vehicleName,
      packageName,
      startDate,
      endDate,
      storeName,
      orderId,
      isUserCancelled = false,
      userLanguage
    } = params

    // 统一应用地址（按钮和占位符都会用到）
    // const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'

    try {
      // 语言优先级：外部传入 > 数据库用户偏好 > en
      let finalLanguage = userLanguage
      if (!finalLanguage) {
        try {
          const user = await prisma.user.findUnique({
            where: { email: to },
            select: { preferredLanguage: true }
          })
          finalLanguage = (user?.preferredLanguage as string | undefined) || 'ja'
        } catch {
          finalLanguage = 'en'
        }
      }

      // 从数据库获取邮件模板，优先使用用户语言偏好
      const template = await this.getEmailTemplate(status, isUserCancelled, finalLanguage || 'en')

      // 替换模板中的变量（支持中英占位符）
      const subject = this.replaceTemplateVariables(template.subject, { ...params, orderId })

      // 生成HTML格式的邮件内容
      const htmlContent = this.generateOrderEmailHTML({
        userName,
        orderNumber,
        status,
        content: this.replaceTemplateVariables(template.content, { ...params, orderId }),
        storeName,
        orderId,
        vehicleName: vehicleName || packageName || '未指定',
        startDate,
        endDate
      })

      const fromAddress = process.env.RESEND_FROM || process.env.EMAIL_FROM || 'Announcement <no-reply@example.com>'
      const result = await this.resend.emails.send({
        from: fromAddress,
        to: [to],
        subject: subject,
        html: htmlContent
      })

      console.log(`邮件发送成功 (语言: ${finalLanguage}):`, result)
      return { success: true, data: result }
    } catch (error) {
      console.error('邮件发送失败:', error)
      return { success: false, error }
    }
  }

  // 发送未付款订单提醒邮件
  async sendPaymentReminderEmail(params: EmailParams): Promise<EmailResult> {
    try {
      // 延迟导入队列，避免循环依赖
      const { addEmailToQueue } = await import('./emailQueue')
      const jobId = await addEmailToQueue({
        ...params,
        status: 'PAYMENT_REMINDER' // 使用特殊的状态标识
      })
      console.log(`付款提醒邮件已添加到队列，任务ID: ${jobId}`)
      return { success: true, data: { jobId } }
    } catch (error) {
      console.error('添加付款提醒邮件到队列失败:', error)
      return { success: false, error }
    }
  }

  // 直接发送付款提醒邮件（队列内部使用）
  async sendPaymentReminderEmailDirectly(params: EmailParams): Promise<EmailResult> {
    const {
      to,
      userName,
      orderNumber,
      vehicleName,
      packageName,
      startDate,
      endDate,
      storeName,
      orderId,
      language
    } = params

    // 统一应用地址（按钮和占位符都会用到）
    // const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'

    try {
      // 语言优先级：外部传入 > 数据库用户偏好 > en
      let finalLanguage = language
      if (!finalLanguage) {
        try {
          const user = await prisma.user.findUnique({
            where: { email: to },
            select: { preferredLanguage: true }
          })
          finalLanguage = (user?.preferredLanguage as string | undefined) || 'ja'
        } catch {
          finalLanguage = 'en'
        }
      }

      // 从数据库获取付款提醒邮件模板
      const template = await this.getPaymentReminderTemplate(finalLanguage || 'en')

      // 替换模板中的变量
      const subject = this.replaceTemplateVariables(template.subject, { ...params, orderId })

      // 生成HTML格式的邮件内容
      const htmlContent = this.generatePaymentReminderHTML({
        userName,
        orderNumber,
        status: 'PAYMENT_REMINDER',
        content: this.replaceTemplateVariables(template.content, { ...params, orderId }),
        storeName,
        orderId,
        vehicleName: vehicleName || packageName || '未指定',
        startDate,
        endDate
      })

      const fromAddress = process.env.RESEND_FROM || process.env.EMAIL_FROM || 'Announcement <no-reply@example.com>'
      const result = await this.resend.emails.send({
        from: fromAddress,
        to: [to],
        subject: subject,
        html: htmlContent
      })

      console.log(`付款提醒邮件发送成功 (语言: ${finalLanguage}):`, result)
      return { success: true, data: result }
    } catch (error) {
      console.error('付款提醒邮件发送失败:', error)
      return { success: false, error }
    }
  }

  // 从数据库获取邮件模板
  private async getEmailTemplate(status: string, isUserCancelled: boolean = false, userLanguage: string = 'en') {
    try {
      // 对于取消状态，需要特殊处理用户取消和管理员取消
      let templateStatus = status
      if (status === 'CANCELLED' && isUserCancelled) {
        templateStatus = 'CANCELLED_USER'
      }
      
      // 首先尝试获取用户偏好的语言模板
      let template = await prisma.emailTemplate.findFirst({
        where: { 
          status: templateStatus,
          language: userLanguage
        }
      })
      
      // 如果找不到用户偏好的语言模板，尝试获取英语模板
      if (!template && userLanguage !== 'en') {
        template = await prisma.emailTemplate.findFirst({
          where: { 
            status: templateStatus,
            language: 'en'
          }
        })
      }
      
      // 如果还是找不到，尝试获取中文模板
      if (!template && userLanguage !== 'zh' && userLanguage !== 'en') {
        template = await prisma.emailTemplate.findFirst({
          where: { 
            status: templateStatus,
            language: 'zh'
          }
        })
      }
      
      // 如果找到了模板，返回它
      if (template) {
        return template
      }
      
      // 如果找不到特定模板，使用默认的取消模板
      if (status === 'CANCELLED') {
        const defaultCancelledTemplate = await prisma.emailTemplate.findFirst({
          where: { 
            status: 'CANCELLED',
            language: userLanguage
          }
        })
        
        if (defaultCancelledTemplate) {
          // 根据是否用户取消来修改标题
          const subject = isUserCancelled 
            ? '您已成功取消租车订单 🗑️'
            : '很抱歉，您的租车订单被取消 ❌'
          return { ...defaultCancelledTemplate, subject }
        }
      }
      
      // 如果都找不到，返回默认模板（根据用户语言）
      return this.getDefaultTemplate(status, userLanguage)
    } catch (error) {
      console.error('获取邮件模板失败:', error)
      // 返回默认模板
      return this.getDefaultTemplate(status, userLanguage)
    }
  }

  // 获取付款提醒邮件模板
  private async getPaymentReminderTemplate(userLanguage: string = 'en') {
    try {
      // 首先尝试获取用户偏好的语言模板
      let template = await prisma.emailTemplate.findFirst({
        where: { 
          status: 'PAYMENT_REMINDER',
          language: userLanguage
        }
      })
      
      // 如果找不到用户偏好的语言模板，尝试获取英语模板
      if (!template && userLanguage !== 'en') {
        template = await prisma.emailTemplate.findFirst({
          where: { 
            status: 'PAYMENT_REMINDER',
            language: 'en'
          }
        })
      }
      
      // 如果还是找不到，尝试获取中文模板
      if (!template && userLanguage !== 'zh' && userLanguage !== 'en') {
        template = await prisma.emailTemplate.findFirst({
          where: { 
            status: 'PAYMENT_REMINDER',
            language: 'zh'
          }
        })
      }
      
      // 如果找到了模板，返回它
      if (template) {
        return template
      }
      
      // 如果找不到，返回默认模板
      return this.getDefaultPaymentReminderTemplate(userLanguage)
    } catch (error) {
      console.error('获取付款提醒邮件模板失败:', error)
      // 返回默认模板
      return this.getDefaultPaymentReminderTemplate(userLanguage)
    }
  }

  // 获取默认模板
  private getDefaultTemplate(status: string, language: string = 'en') {
    // 如果是付款提醒状态，使用专门的付款提醒模板
    if (status === 'PAYMENT_REMINDER') {
      return this.getDefaultPaymentReminderTemplate(language)
    }
    
    const templates = {
      zh: {
        subject: '订单状态更新通知',
        content: `Hi [用户姓名]，

您的订单状态已更新。

订单信息如下：
- 订单编号：[订单编号]
- 车型：[车型名称]
- 取车时间：[取车时间]
- 还车时间：[还车时间]
- 门店：[门店名称]

👉 [点击查看订单详情]([订单详情链接])

感谢您的使用！
Soukyo 租车团队`,
        emoji: '📧'
      },
      en: {
        subject: 'Order Status Update Notification',
        content: `Hi [用户姓名],

Your order status has been updated.

Order details:
- Order Number: [订单编号]
- Vehicle: [车型名称]
- Pickup Date: [取车时间]
- Return Date: [还车时间]
- Store: [门店名称]

👉 [View Order Details]([订单详情链接])

Thank you for using our service!
Soukyo Car Rental Team`,
        emoji: '📧'
      },
      ja: {
        subject: '注文状況更新通知',
        content: `[用户姓名]様、

注文状況が更新されました。

注文詳細：
- 注文番号：[订单编号]
- 車種：[车型名称]
- 受取日時：[取车时间]
- 返却日時：[还车时间]
- 店舗：[门店名称]

👉 [注文詳細を確認]([订单详情链接])

ご利用ありがとうございます！
Soukyo レンタカー`,
        emoji: '📧'
      }
    }
    
    return templates[language as keyof typeof templates] || templates.en
  }

  // 获取默认付款提醒模板
  private getDefaultPaymentReminderTemplate(language: string = 'en') {
    const templates = {
      zh: {
        subject: '付款提醒 - 您的租车订单等待付款 💳',
        content: `Hi [用户姓名]，

您的租车订单已创建，但尚未完成付款。

订单信息：
- 订单编号：[订单编号]
- 车型：[车型名称]
- 取车时间：[取车时间]
- 还车时间：[还车时间]
- 门店：[门店名称]
- 总金额：[总金额]

⚠️ 请在30分钟内完成付款，否则订单将自动取消。

👉 [点击完成付款]([订单详情链接])

如有任何问题，请联系我们的客服团队。

感谢您的使用！
Soukyo 租车团队`,
        emoji: '💳'
      },
      en: {
        subject: 'Payment Reminder - Your Car Rental Order Awaits Payment 💳',
        content: `Hi [用户姓名],

Your car rental order has been created but payment is still pending.

Order details:
- Order Number: [订单编号]
- Vehicle: [车型名称]
- Pickup Date: [取车时间]
- Return Date: [还车时间]
- Store: [门店名称]
- Total Amount: [总金额]

⚠️ Please complete payment within 30 minutes, or the order will be automatically cancelled.

👉 [Complete Payment]([订单详情链接])

If you have any questions, please contact our customer service team.

Thank you for choosing us!
Soukyo Car Rental Team`,
        emoji: '💳'
      },
      ja: {
        subject: '支払いリマインダー - レンタカー注文の支払いをお待ちしています 💳',
        content: `Hi [用户姓名],

レンタカー注文が作成されましたが、支払いがまだ完了していません。

注文詳細：
- 注文番号：[订单编号]
- 車両：[车型名称]
- 受取日：[取车时间]
- 返却日：[还车时间]
- 店舗：[门店名称]
- 合計金額：[总金额]

⚠️ 30分以内に支払いを完了してください。そうしないと、注文は自動的にキャンセルされます。

👉 [支払いを完了]([订单详情链接])

ご質問がございましたら、カスタマーサービスチームまでお問い合わせください。

ご利用ありがとうございます！
Soukyo レンタカー チーム`,
        emoji: '💳'
      }
    }

    return templates[language as keyof typeof templates] || templates.en
  }

  // 替换模板中的变量
  private replaceTemplateVariables(template: string, params: EmailParams & { isUserCancelled?: boolean }): string {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const orderDetails = {
      vehicleName: params.vehicleName || params.packageName || '未指定',
      startDate: this.formatDate(params.startDate),
      endDate: this.formatDate(params.endDate),
      startTime: this.formatTime(params.startDate),
      endTime: this.formatTime(params.endDate)
    }

    // 同时支持中英文占位符，以及 URL 中的 [orderId]
    return template
      // 中文占位符
      .replace(/\[用户姓名\]/g, params.userName)
      .replace(/\[订单编号\]/g, params.orderNumber)
      .replace(/\[车型名称\]/g, orderDetails.vehicleName)
      .replace(/\[取车时间\]/g, `${orderDetails.startDate} ${orderDetails.startTime}`)
      .replace(/\[还车时间\]/g, `${orderDetails.endDate} ${orderDetails.endTime}`)
      .replace(/\[门店名称\]/g, params.storeName)
      .replace(/\[订单详情链接\]/g, `${appUrl}/orders/${params.orderId}`)
      // 英文占位符
      .replace(/\[UserName\]/g, params.userName)
      .replace(/\[OrderNumber\]/g, params.orderNumber)
      .replace(/\[VehicleName\]/g, orderDetails.vehicleName)
      .replace(/\[PickupTime\]/g, `${orderDetails.startDate} ${orderDetails.startTime}`)
      .replace(/\[PickupDate\]/g, `${orderDetails.startDate} ${orderDetails.startTime}`)
      .replace(/\[ReturnTime\]/g, `${orderDetails.endDate} ${orderDetails.endTime}`)
      .replace(/\[ReturnDate\]/g, `${orderDetails.endDate} ${orderDetails.endTime}`)
      .replace(/\[StoreName\]/g, params.storeName)
      .replace(/\[OrderDetailsLink\]/g, `${appUrl}/orders/${params.orderId}`)
      // 通用占位符
      .replace(/\[orderId\]/g, String(params.orderId))
  }

  // 格式化日期
  private formatDate(date: Date | string): string {
    const d = new Date(date)
    return d.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // 格式化时间
  private formatTime(date: Date | string): string {
    const d = new Date(date)
    return d.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  // 生成邮件HTML内容
  private generateOrderEmailHTML(params: EmailTemplateParams & { content: string }): string {
    const { userName, orderNumber, content, storeName, orderId, vehicleName, startDate, endDate, status } = params

    const orderDetails = {
      vehicleName,
      startDate: this.formatDate(startDate),
      endDate: this.formatDate(endDate),
      startTime: this.formatTime(startDate),
      endTime: this.formatTime(endDate)
    }

    // 将纯文本内容转换为HTML格式
    const formattedContent = this.formatContentToHTML(content)

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'

    // 状态徽章
    const statusMap: Record<string, { text: string; color: string; bg: string }> = {
      PENDING:   { text: '待确认', color: '#92400e', bg: '#fef3c7' },
      CONFIRMED: { text: '已确认', color: '#065f46', bg: '#d1fae5' },
      ONGOING:   { text: '进行中', color: '#1e40af', bg: '#dbeafe' },
      COMPLETED: { text: '已完成', color: '#1f2937', bg: '#e5e7eb' },
      CANCELLED: { text: '已取消', color: '#991b1b', bg: '#fee2e2' },
      REFUNDED:  { text: '已退款', color: '#1f2937', bg: '#e5e7eb' },
    }
    const badge = statusMap[status] || { text: status, color: '#1f2937', bg: '#e5e7eb' }

    return `
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>订单状态通知</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header { text-align: center; margin-bottom: 24px; }
          .logo {
            font-size: 24px; font-weight: bold; color: #2563eb; margin-bottom: 8px;
          }
          .status-badge { display:inline-block; padding:6px 10px; border-radius:999px; font-weight:600; font-size:12px; }
          .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #1e293b;
          }
          .status-message {
            background-color: #f0f9ff;
            border-left: 4px solid #2563eb;
            padding: 15px;
            margin-bottom: 25px;
            border-radius: 4px;
            color: #1e293b;
          }
          .order-details {
            background-color: #f8fafc;
            border-radius: 6px;
            padding: 20px;
            margin-bottom: 25px;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .detail-label {
            font-weight: 600;
            color: #64748b;
          }
          .detail-value {
            color: #1e293b;
          }
          .cta-button {
            display: inline-block;
            background-color: #2563eb;
            color: white;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: 600;
            margin-top: 20px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            color: #64748b;
            font-size: 14px;
          }
          .content-text {
            margin-bottom: 15px;
            color: #374151;
          }
          .link-fallback { margin-top: 12px; font-size: 12px; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Soukyo 租车</div>
            <span class="status-badge" style="background:${badge.bg}; color:${badge.color}">${badge.text}</span>
          </div>
          
          <div class="greeting">
            您好 ${userName}，
          </div>
          
          <div class="status-message">
            ${formattedContent}
          </div>
          
          <div class="order-details">
            <h3 style="margin-top: 0; color: #1e293b;">订单信息</h3>
            <div class="detail-row">
              <span class="detail-label">订单编号：</span>
              <span class="detail-value">#${orderNumber}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">车型/套餐：</span>
              <span class="detail-value">${orderDetails.vehicleName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">取车时间：</span>
              <span class="detail-value">${orderDetails.startDate} ${orderDetails.startTime}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">还车时间：</span>
              <span class="detail-value">${orderDetails.endDate} ${orderDetails.endTime}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">门店：</span>
              <span class="detail-value">${storeName}</span>
            </div>
          </div>
          
          <div style="text-align: center;">
            <a href="${appUrl}/orders/${orderId}" class="cta-button">
              查看订单详情
            </a>
            <div class="link-fallback">如果按钮无法点击，请复制此链接到浏览器：<br />
              <a href="${appUrl}/orders/${orderId}" style="color:#2563eb; text-decoration:none">${appUrl}/orders/${orderId}</a>
            </div>
          </div>
          
          <div class="footer">
            <p>感谢您的使用！</p>
            <p>Soukyo 租车团队</p>
            <p style="margin-top: 15px; font-size: 12px; color: #94a3b8;">
              如果您有任何问题，请联系我们的客服团队
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  // 生成付款提醒邮件HTML
  private generatePaymentReminderHTML(params: EmailTemplateParams & { content: string }): string {
    const {
      userName,
      orderNumber,
      content,
      storeName,
      orderId,
      vehicleName,
      startDate,
      endDate
    } = params

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const orderUrl = `${appUrl}/orders/${orderId}`

    return `
      <!DOCTYPE html>
      <html lang="zh">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>付款提醒</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .order-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .order-details h3 { margin-top: 0; color: #333; }
          .order-details p { margin: 5px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💳 付款提醒</h1>
            <p>您的租车订单等待付款</p>
          </div>
          
          <div class="content">
            <div style="margin-bottom: 20px;">
              <h2>您好 ${userName}，</h2>
              <p>您的租车订单等待付款，请及时处理。</p>
            </div>
            
            <div class="order-details">
              <h3>订单信息</h3>
              <p><strong>订单编号：</strong>${orderNumber}</p>
              <p><strong>车型：</strong>${vehicleName}</p>
              <p><strong>门店：</strong>${storeName}</p>
              <p><strong>取车时间：</strong>${this.formatDate(startDate)}</p>
              <p><strong>还车时间：</strong>${this.formatDate(endDate)}</p>
            </div>
            
            <div class="warning">
              <strong>⚠️ 重要提醒：</strong>
              <p>请在30分钟内完成付款，否则订单将自动取消。</p>
            </div>
            
            <div style="text-align: center;">
              <a href="${orderUrl}" class="button">立即完成付款</a>
            </div>
            
            <div style="margin-top: 30px;">
              ${this.formatContentToHTML(content)}
            </div>
          </div>
          
          <div class="footer">
            <p>如有任何问题，请联系我们的客服团队</p>
            <p>© 2024 Soukyo 租车. 保留所有权利.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  // 将纯文本内容转换为HTML格式
  private formatContentToHTML(content: string): string {
    return content
      .split('\n')
      .map(line => {
        // 处理空行
        if (line.trim() === '') {
          return '<br>'
        }
        
        // 处理列表项（以 - 开头）
        if (line.trim().startsWith('-')) {
          return `<li>${line.trim().substring(1).trim()}</li>`
        }
        
        // 处理链接格式 [文本](链接)
        const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g
        const processedLine = line.replace(linkPattern, '<a href="$2" style="color: #2563eb; text-decoration: none;">$1</a>')
        
        // 处理表情符号 - 使用文字替代，避免乱码
        const emojiMap: Record<string, string> = {
          '📧': '<span style="color: #2563eb;">📧</span>',
          '✅': '<span style="color: #059669;">✓</span>',
          '❌': '<span style="color: #dc2626;">✗</span>',
          '🗑️': '<span style="color: #dc2626;">🗑</span>',
          '👉': '<span style="color: #2563eb;">→</span>'
        }
        
        let finalLine = processedLine
        Object.entries(emojiMap).forEach(([emoji, replacement]) => {
          finalLine = finalLine.replace(new RegExp(emoji, 'g'), replacement)
        })
        
        return `<p class="content-text">${finalLine}</p>`
      })
      .join('')
      .replace(/<li>/g, '<ul style="margin: 10px 0; padding-left: 20px;"><li>')
      .replace(/<\/li>/g, '</li></ul>')
      .replace(/<\/ul><ul/g, '</ul><ul')
      .replace(/<br><\/ul>/g, '</ul>')
      .replace(/<br><br>/g, '<br>')
  }
}

// 创建单例实例
export const emailService = new EmailService()
