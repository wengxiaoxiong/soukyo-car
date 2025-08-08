# 邮件触发逻辑总结

## 邮件触发时机和标题配置

根据您的要求，系统已正确配置了以下邮件触发逻辑：

### 1. 订单创建成功
- **触发时机**: 用户提交订单后立即
- **邮件标题**: 您的租车订单已成功提交 ✅
- **触发位置**: `lib/actions/booking.ts` - `createBooking` 函数
- **状态**: PENDING

### 2. 商家已确认订单
- **触发时机**: 管理后台确认后
- **邮件标题**: 商家已确认您的租车订单 🚗
- **触发位置**: `app/actions/orders.ts` - `updateOrderStatus` 函数
- **状态**: CONFIRMED

### 3. 商家取消订单
- **触发时机**: 管理后台点击取消
- **邮件标题**: 很抱歉，您的租车订单被取消 ❌
- **触发位置**: `app/actions/orders.ts` - `updateOrderStatus` 函数
- **状态**: CANCELLED (isUserCancelled: false)

### 4. 用户取消订单
- **触发时机**: 用户主动取消
- **邮件标题**: 您已成功取消租车订单 🗑️
- **触发位置**: `lib/actions/booking.ts` - `cancelOrder` 函数
- **状态**: CANCELLED (isUserCancelled: true)

### 5. 订单进行中
- **触发时机**: 到达租车开始时间
- **邮件标题**: 订单开始，祝您旅途愉快 🌟
- **触发位置**: `app/actions/orders.ts` - `updateOrderStatus` 函数
- **状态**: ONGOING

### 6. 订单完成
- **触发时机**: 订单结束时间到达
- **邮件标题**: 订单已完成，感谢您的使用 🙏
- **触发位置**: `app/actions/orders.ts` - `updateOrderStatus` 函数
- **状态**: COMPLETED

### 7. 订单退款成功
- **触发时机**: 管理后台确认退款
- **邮件标题**: 退款已处理成功 💰
- **触发位置**: `app/actions/orders.ts` - `updateOrderStatus` 函数
- **状态**: REFUNDED

## 技术实现细节

### 1. 邮件服务类 (`lib/email/emailService.ts`)
```typescript
// 支持区分用户取消和管理员取消
async sendOrderStatusEmail(params: EmailParams & { isUserCancelled?: boolean })
```

### 2. 邮件标题配置
```typescript
private getEmailConfig(status: string, isUserCancelled: boolean = false) {
  const configs = {
    'PENDING': { subject: '您的租车订单已成功提交 ✅' },
    'CONFIRMED': { subject: '商家已确认您的租车订单 🚗' },
    'CANCELLED': { 
      subject: isUserCancelled ? '您已成功取消租车订单 🗑️' : '很抱歉，您的租车订单被取消 ❌'
    },
    'ONGOING': { subject: '订单开始，祝您旅途愉快 🌟' },
    'COMPLETED': { subject: '订单已完成，感谢您的使用 🙏' },
    'REFUNDED': { subject: '退款已处理成功 💰' }
  }
}
```

### 3. 触发位置确认

#### 订单创建 (`lib/actions/booking.ts`)
```typescript
// 发送订单创建成功邮件
await emailService.sendOrderStatusEmail({
  to: session.user.email!,
  userName: session.user.name || '用户',
  orderNumber: order.orderNumber,
  status: 'PENDING',
  vehicleName: vehicle.name,
  startDate: order.startDate,
  endDate: order.endDate,
  storeName: vehicle.store.name,
  orderId: order.id,
  isUserCancelled: false
})
```

#### 用户取消订单 (`lib/actions/booking.ts`)
```typescript
// 发送订单取消邮件（用户主动取消）
await emailService.sendOrderStatusEmail({
  to: order.user.email,
  userName: order.user.name || '用户',
  orderNumber: order.orderNumber,
  status: 'CANCELLED',
  vehicleName: order.vehicle?.name,
  packageName: order.package?.name,
  startDate: order.startDate,
  endDate: order.endDate,
  storeName: order.store.name,
  orderId: order.id,
  isUserCancelled: true // 标记为用户主动取消
})
```

#### 管理员操作 (`app/actions/orders.ts`)
```typescript
// 发送邮件通知（管理员操作）
await emailService.sendOrderStatusEmail({
  to: order.user.email,
  userName: order.user.name || '用户',
  orderNumber: order.orderNumber,
  status: status,
  vehicleName: order.vehicle?.name,
  packageName: order.package?.name,
  startDate: order.startDate,
  endDate: order.endDate,
  storeName: order.store.name,
  orderId: order.id,
  isUserCancelled: false // 管理员操作，不是用户主动取消
})
```

## 邮件内容模板

每封邮件包含以下信息：
- 用户姓名
- 订单编号 (#ORD-xxxxx)
- 车型/套餐名称
- 取车时间 (日期 + 时间)
- 还车时间 (日期 + 时间)
- 门店信息
- 订单详情链接
- 品牌标识和联系方式

## 错误处理

- 邮件发送失败不会影响订单状态更新
- 所有邮件发送错误都会记录到控制台
- 使用 try-catch 包装邮件发送逻辑

## 测试验证

1. **API Key 已配置**: `re_4ZhWRPtX_DSfindR5XRdzEg7z11M7agcV`
2. **测试邮件**: 使用邮件模板编辑器
3. **前端模板管理**: `/admin/email-templates`
4. **测试API**: `/api/test-email`

## 总结

✅ **邮件触发逻辑已完全按照您的要求配置**
✅ **区分了用户取消和管理员取消的邮件标题**
✅ **所有触发时机都已正确实现**
✅ **邮件内容模板美观且信息完整**
✅ **错误处理机制完善**
✅ **提供了测试和管理的工具**

现在系统已经具备了完整的邮件通知功能，可以在订单状态变更时自动发送相应的邮件给用户！
