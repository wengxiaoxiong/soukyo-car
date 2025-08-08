# 邮件模板系统实现文档

## 概述

本系统实现了完整的邮件模板管理功能，包括数据库持久化、前端编辑界面、邮件发送服务和通知系统增强。

## 功能特性

### 1. 数据库持久化
- **EmailTemplate 表**: 存储邮件模板配置
- **Notification 表增强**: 新增 `link` 字段支持跳转链接
- **字段结构**:
  ```sql
  EmailTemplate {
    id: String (主键)
    status: String (唯一，模板标识)
    subject: String (邮件标题)
    content: String (邮件正文模板)
    emoji: String? (表情符号)
    isActive: Boolean (是否启用)
    createdAt: DateTime
    updatedAt: DateTime
  }
  
  Notification {
    // ... 原有字段
    link: String? (跳转链接)
  }
  ```

### 2. 邮件模板管理界面
- **位置**: `/admin/email-templates`
- **功能**:
  - 查看所有邮件模板列表
  - 编辑模板标题、内容和表情符号
  - 实时预览模板效果
  - 发送测试邮件
  - 保存模板到数据库

### 3. 邮件发送服务
- **文件**: `lib/email/emailService.ts`
- **功能**:
  - 从数据库读取模板配置
  - 支持模板变量替换
  - 自动生成 HTML 邮件内容
  - 集成 Resend API 发送邮件

### 4. 通知系统增强
- **丰富通知内容**: 包含车型、时间、门店等信息
- **跳转链接**: 点击通知直接跳转到订单详情页
- **自动标记已读**: 点击通知时自动标记为已读

## 模板变量支持

邮件模板支持以下变量，会在发送时自动替换：

- `[用户姓名]` - 用户姓名
- `[订单编号]` - 订单编号
- `[车型名称]` - 车辆或套餐名称
- `[取车时间]` - 取车日期和时间
- `[还车时间]` - 还车日期和时间
- `[门店名称]` - 门店名称
- `[订单详情链接]` - 订单详情页面链接

## 默认模板配置

系统预置了以下邮件模板：

| 状态 | 标题 | 触发时机 |
|------|------|----------|
| PENDING | 您的租车订单已成功提交 ✅ | 用户提交订单后立即 |
| CONFIRMED | 商家已确认您的租车订单 🚗 | 管理后台确认后 |
| CANCELLED | 很抱歉，您的租车订单被取消 ❌ | 管理后台点击取消 |
| CANCELLED_USER | 您已成功取消租车订单 🗑️ | 用户主动取消 |
| ONGOING | 订单开始，祝您旅途愉快 🌟 | 到达租车开始时间 |
| COMPLETED | 订单已完成，感谢您的使用 🙏 | 订单结束时间到达 |
| REFUNDED | 退款已处理成功 💰 | 管理后台确认退款 |

## API 接口

### 邮件模板管理 API

#### GET /api/email-templates
获取所有邮件模板

#### POST /api/email-templates
创建或更新邮件模板
```json
{
  "status": "PENDING",
  "subject": "邮件标题",
  "content": "邮件内容模板",
  "emoji": "✅",
  "isActive": true
}
```

#### DELETE /api/email-templates?status=PENDING
删除指定状态的邮件模板

### 测试邮件 API

#### POST /api/test-email
发送测试邮件
```json
{
  "to": "test@example.com",
  "template": {
    "status": "PENDING",
    "subject": "测试标题",
    "content": "测试内容"
  }
}
```

## 使用流程

### 1. 管理员配置模板
1. 访问 `/admin/email-templates`
2. 选择要编辑的模板
3. 修改标题、内容或表情符号
4. 点击"保存"按钮
5. 可选择发送测试邮件验证效果

### 2. 系统自动发送邮件
当订单状态发生变化时，系统会：
1. 根据订单状态查找对应模板
2. 替换模板中的变量
3. 生成 HTML 邮件内容
4. 通过 Resend API 发送邮件
5. 创建站内通知（包含跳转链接）

### 3. 用户接收通知
用户可以通过以下方式接收通知：
- **邮件通知**: 发送到用户邮箱
- **站内通知**: 显示在通知中心，点击可跳转到订单详情

## 技术实现

### 数据库迁移
```bash
# 创建迁移
npx prisma migrate dev --name add-email-templates-and-notification-link

# 生成 Prisma 客户端
npx prisma generate

# 初始化模板数据
npx tsx scripts/seed-email-templates.ts
```

### 环境变量配置
```env
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 依赖包
- `resend`: 邮件发送服务
- `@prisma/client`: 数据库 ORM
- `sonner`: 通知提示组件

## 注意事项

1. **邮件发送失败处理**: 邮件发送失败不会影响订单状态更新
2. **模板变量**: 确保模板中的变量名称正确
3. **数据库连接**: 确保数据库连接正常
4. **API 密钥**: 确保 Resend API 密钥有效
5. **环境变量**: 确保 `NEXT_PUBLIC_APP_URL` 配置正确

## 扩展功能

### 多语言支持
可以通过以下方式扩展多语言支持：
1. 在 EmailTemplate 表中添加 `language` 字段
2. 根据用户语言偏好选择对应模板
3. 支持英文、日文、中文等多种语言

### 模板版本管理
可以添加模板版本管理功能：
1. 记录模板修改历史
2. 支持模板回滚
3. 模板变更通知

### 邮件发送统计
可以添加邮件发送统计功能：
1. 记录邮件发送日志
2. 统计发送成功率
3. 监控邮件发送性能
