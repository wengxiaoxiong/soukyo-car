# 邮件发送逻辑更新 - 付款提醒系统

## 概述

根据新的业务需求，邮件发送逻辑已经进行了重大更新。现在系统支持更精确的订单状态邮件发送，包括付款提醒功能。

## 新的邮件发送流程

### 1. 订单创建阶段
- **订单创建时**：不发送任何邮件
- **订单状态**：PENDING（待确认）

### 2. 支付成功阶段
- **触发条件**：用户完成支付
- **发送邮件**：PENDING 邮件（表示已下单但未确认）
- **邮件内容**：告知用户订单已创建，等待商家确认
- **订单状态**：保持 PENDING（等待商家确认）
- **重要说明**：支付成功后订单状态保持PENDING，不会自动确认

### 3. 商家确认阶段
- **触发条件**：管理员在后台手动确认订单
- **发送邮件**：CONFIRMED 邮件
- **邮件内容**：告知用户订单已确认，可以取车
- **订单状态**：CONFIRMED（已确认）
- **重要说明**：只有管理员在后台手动操作才能将订单状态改为CONFIRMED

### 4. 付款提醒阶段
- **触发条件**：订单创建超过10分钟且未付款
- **发送邮件**：PAYMENT_REMINDER 邮件
- **邮件内容**：提醒用户完成付款，否则订单将自动取消
- **频率控制**：1小时内只发送一次提醒

## 新增功能

### 1. 付款提醒邮件模板
- **状态标识**：PAYMENT_REMINDER
- **支持语言**：中文、英文、日文
- **模板特点**：
  - 突出显示付款提醒
  - 包含订单详细信息
  - 提供直接付款链接
  - 30分钟付款期限警告

### 2. 定时任务处理
- **API端点**：`/api/cron/payment-reminders`
- **执行频率**：建议每5-10分钟执行一次
- **功能**：
  - 查找超过10分钟的未付款订单
  - 避免重复发送提醒
  - 创建系统通知记录

### 3. 邮件队列增强
- **新增状态**：支持 PAYMENT_REMINDER 状态处理
- **队列路由**：根据邮件状态选择不同的发送方法
- **错误处理**：完善的错误处理和重试机制

## 技术实现

### 1. 邮件服务更新
```typescript
// 新增付款提醒邮件方法
async sendPaymentReminderEmail(params: EmailParams): Promise<EmailResult>
async sendPaymentReminderEmailDirectly(params: EmailParams): Promise<EmailResult>
```

### 2. 邮件模板系统
- **数据库表**：email_templates
- **新增状态**：PAYMENT_REMINDER
- **多语言支持**：zh, en, ja

### 3. 定时任务
```bash
# 建议的cron配置（每5分钟执行一次）
*/5 * * * * curl -X POST https://your-domain.com/api/cron/payment-reminders
```

## 数据库变更

### 邮件模板表
```sql
-- 新增付款提醒模板
INSERT INTO email_templates (status, language, subject, content, emoji, is_active)
VALUES 
('PAYMENT_REMINDER', 'zh', '付款提醒 - 您的租车订单等待付款 💳', '...', '💳', true),
('PAYMENT_REMINDER', 'en', 'Payment Reminder - Your Car Rental Order Awaits Payment 💳', '...', '💳', true),
('PAYMENT_REMINDER', 'ja', '支払いリマインダー - レンタカー注文の支払いをお待ちしています 💳', '...', '💳', true);
```

## 部署说明

### 1. 初始化模板
```bash
# 运行付款提醒模板初始化脚本
npx tsx scripts/seed-payment-reminder-templates.ts
```

### 2. 设置定时任务
```bash
# 添加到 crontab
*/5 * * * * curl -X POST https://your-domain.com/api/cron/payment-reminders
```

### 3. 环境变量
```env
# 可选：设置cron secret用于安全验证
CRON_SECRET=your-secret-key
```

## 测试

### 1. 手动测试付款提醒
```bash
# 调用API手动触发付款提醒处理
curl -X POST https://your-domain.com/api/email-queue \
  -H "Content-Type: application/json" \
  -d '{"action": "process_payment_reminders"}'
```

### 2. 测试邮件模板
- 访问 `/admin/email-templates` 页面
- 选择 "付款提醒" 状态
- 编辑和测试邮件模板

## 注意事项

1. **避免重复发送**：系统会检查1小时内是否已发送过提醒邮件
2. **订单状态管理**：确保订单状态正确更新
3. **邮件队列监控**：定期检查邮件队列状态
4. **错误处理**：所有邮件发送失败都会被记录和重试

## 监控和维护

### 1. 队列监控
- 访问 `/admin/email-queue` 查看队列状态
- 监控队列积压情况

### 2. 日志监控
- 查看服务器日志中的邮件发送记录
- 监控错误率和重试情况

### 3. 性能优化
- 定期清理过期的邮件队列记录
- 监控数据库查询性能

## 故障排除

### 常见问题

1. **邮件未发送**
   - 检查邮件服务配置
   - 验证API密钥
   - 查看队列状态

2. **重复发送提醒**
   - 检查通知记录
   - 验证时间戳逻辑

3. **模板显示错误**
   - 检查模板变量替换
   - 验证多语言支持

### 调试命令
```bash
# 检查队列状态
curl https://your-domain.com/api/email-queue

# 手动处理付款提醒
curl -X POST https://your-domain.com/api/cron/payment-reminders
```
