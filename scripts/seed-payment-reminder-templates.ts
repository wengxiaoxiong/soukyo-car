import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedPaymentReminderTemplates() {
  try {
    console.log('开始初始化付款提醒邮件模板...')

    const templates = [
      {
        status: 'PAYMENT_REMINDER',
        language: 'zh',
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
        emoji: '💳',
        isActive: true
      },
      {
        status: 'PAYMENT_REMINDER',
        language: 'en',
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
        emoji: '💳',
        isActive: true
      },
      {
        status: 'PAYMENT_REMINDER',
        language: 'ja',
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
        emoji: '💳',
        isActive: true
      }
    ]

    for (const template of templates) {
      // 使用 upsert 来避免重复插入
      await prisma.emailTemplate.upsert({
        where: {
          status_language: {
            status: template.status,
            language: template.language
          }
        },
        update: {
          subject: template.subject,
          content: template.content,
          emoji: template.emoji,
          isActive: template.isActive
        },
        create: {
          status: template.status,
          language: template.language,
          subject: template.subject,
          content: template.content,
          emoji: template.emoji,
          isActive: template.isActive
        }
      })

      console.log(`已创建/更新 ${template.language} 语言的付款提醒模板`)
    }

    console.log('付款提醒邮件模板初始化完成！')
  } catch (error) {
    console.error('初始化付款提醒邮件模板失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  seedPaymentReminderTemplates()
}

export { seedPaymentReminderTemplates }
