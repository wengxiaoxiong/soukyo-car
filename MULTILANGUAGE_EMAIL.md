# 多语言邮件模板系统

## 功能概述

本系统支持多语言邮件模板，用户可以根据需要选择不同的语言接收邮件，并在邮件中提供语言切换功能。

## 支持的语言

- 🇺🇸 **English (en)** - 英文
- 🇯🇵 **日本語 (ja)** - 日文  
- 🇨🇳 **中文 (zh)** - 中文

## 数据库结构

### EmailTemplate 表

```sql
model EmailTemplate {
  id          String   @id @default(cuid())
  status      String   // PENDING, CONFIRMED, CANCELLED, ONGOING, COMPLETED, REFUNDED
  language    String   @default("en") // en, ja, zh
  subject     String
  content     String   @db.Text
  emoji       String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@unique([status, language])
  @@map("email_templates")
}
```

## 使用方法

### 1. 发送多语言邮件

```typescript
import { emailService } from '@/lib/email/emailService'

await emailService.sendOrderStatusEmail({
  to: 'user@example.com',
  userName: 'John Doe',
  orderNumber: 'ORD-12345',
  status: 'CONFIRMED',
  vehicleName: 'Toyota RAV4',
  startDate: new Date(),
  endDate: new Date(),
  storeName: 'Narita Airport Store',
  orderId: 'order-id',
  language: 'en' // 或 'ja', 'zh'
})
```

### 2. 邮件中的语言切换

每封邮件底部都包含语言切换链接：

```html
<div class="language-switcher">
  <span>View in:</span>
  <a href="/orders/12345?lang=en">🇺🇸 English</a>
  <a href="/orders/12345?lang=ja">🇯🇵 日本語</a>
  <a href="/orders/12345?lang=zh">🇨🇳 中文</a>
</div>
```

### 3. 模板回退机制

- 优先使用指定语言的模板
- 如果指定语言模板不存在，回退到英文模板
- 如果英文模板也不存在，使用默认模板

## 模板变量

支持以下变量替换：

| 变量 | 英文 | 日文 | 中文 |
|------|------|------|------|
| 用户姓名 | [UserName] | [UserName] | [UserName] |
| 订单编号 | [OrderNumber] | [OrderNumber] | [OrderNumber] |
| 车型名称 | [VehicleName] | [VehicleName] | [VehicleName] |
| 取车时间 | [PickupTime] | [PickupTime] | [PickupTime] |
| 还车时间 | [ReturnTime] | [ReturnTime] | [ReturnTime] |
| 门店名称 | [StoreName] | [StoreName] | [StoreName] |
| 订单详情链接 | [OrderDetailsLink] | [OrderDetailsLink] | [OrderDetailsLink] |

## 测试功能

### 测试页面

访问 `/admin/email-templates` 页面可以：

1. 选择邮件语言（英文/日文/中文）
2. 创建测试通知
3. 同时发送对应语言的邮件
4. 查看邮件中的语言切换功能

### 运行种子脚本

```bash
# 创建多语言邮件模板
npx tsx scripts/seed-multilanguage-email-templates.ts
```

## 邮件模板管理

### 管理后台

访问 `/admin/email-templates` 可以：

1. 查看所有语言的邮件模板
2. 编辑模板内容
3. 测试邮件发送
4. 管理模板状态

### API 接口

- `GET /api/email-templates` - 获取所有模板
- `POST /api/email-templates` - 创建/更新模板
- `DELETE /api/email-templates` - 删除模板

## 环境变量配置

```env
# 邮件发送配置
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_PROD=no-reply@yourdomain.com
RESEND_FROM_TEST=onboarding@resend.dev
RESEND_ALLOWED_TEST_TO=your_email@example.com

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 邮件示例

### 英文邮件
```
Hi John Doe,

Great news! Your car rental order has been confirmed and is ready for pickup.

Order Information:
- Order Number: ORD-12345
- Vehicle: Toyota RAV4
- Pickup Time: January 15, 2025 2:00 PM
- Return Time: January 17, 2025 12:00 PM
- Store: Narita Airport Store

👉 View Order Details

Thank you for choosing Soukyo Car Rental!
Soukyo Car Rental Team
```

### 日文邮件
```
John Doe様、

素晴らしいニュースです！レンタカー注文が確認され、受取準備が整いました。

注文情報：
- 注文番号：ORD-12345
- 車両：トヨタ RAV4
- 受取時間：2025年1月15日 14:00
- 返却時間：2025年1月17日 12:00
- 店舗：成田空港店

👉 注文詳細を表示

Soukyo レンタカーをご利用いただき、ありがとうございます！
Soukyo レンタカー チーム
```

### 中文邮件
```
您好 John Doe，

好消息！您的租车订单已确认，可以取车了。

订单信息：
- 订单编号：ORD-12345
- 车型：丰田 RAV4
- 取车时间：2025年1月15日 14:00
- 还车时间：2025年1月17日 12:00
- 门店：成田机场店

👉 查看订单详情

感谢您选择 Soukyo 租车！
Soukyo 租车团队
```

## 扩展新语言

要添加新语言支持：

1. 在 `types/email.ts` 中添加语言配置
2. 在 `lib/email/emailService.ts` 中添加翻译
3. 运行种子脚本创建新语言模板
4. 更新邮件模板编辑器支持新语言

## 注意事项

1. 确保所有语言模板都包含相同的变量占位符
2. 日期和时间格式会根据语言自动调整
3. 邮件中的语言切换链接会跳转到对应的订单详情页
4. 测试模式下只能发送到配置的测试邮箱



