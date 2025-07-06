# 套餐购买系统 - 快速开始

## 概述

这是一个从汽车租赁系统重构而来的套餐购买系统，提供了简化的商品销售功能。

## 🚀 快速开始

### 1. 运行数据库迁移

```bash
# 运行完整的迁移脚本（推荐）
npm run migrate-packages

# 或者手动步骤
npx prisma generate
npx prisma db push
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 访问应用

- **用户端套餐列表**: http://localhost:3000/packages
- **管理员后台**: http://localhost:3000/admin/packages
- **用户登录**: http://localhost:3000/auth/signin

## 📦 主要功能

### 用户功能
- ✅ 浏览套餐列表
- ✅ 搜索和筛选套餐
- ✅ 查看套餐详情（多图片 + Markdown内容）
- ✅ 购买套餐（库存管理）
- ✅ 查看订单历史
- ✅ 接收通知

### 管理员功能
- ✅ 套餐CRUD管理
- ✅ 库存管理
- ✅ 订单管理
- ✅ 用户通知
- ✅ 数据统计

## 🎯 核心特性

### 套餐系统
- **多媒体支持**: 支持多张图片和缩略图
- **富文本内容**: Markdown格式的详细描述
- **库存管理**: 实时库存跟踪，自动减库存
- **分类管理**: 灵活的分类和标签系统
- **价格管理**: 支持原价和折扣价显示

### 订单系统
- **简化流程**: 选择套餐 → 填写信息 → 创建订单
- **库存检查**: 下单前自动检查库存
- **自动通知**: 用户和管理员自动接收通知
- **状态管理**: 完整的订单状态跟踪

## 🛠️ 技术栈

- **前端**: Next.js 15 + React 19 + TypeScript
- **后端**: Next.js API Routes
- **数据库**: PostgreSQL + Prisma ORM
- **认证**: NextAuth.js
- **UI组件**: Tailwind CSS + Radix UI
- **状态管理**: React Hooks

## 📁 项目结构

```
├── prisma/
│   └── schema.prisma          # 数据库模型
├── lib/actions/
│   ├── packages.ts           # 套餐相关操作
│   ├── orders.ts             # 订单相关操作
│   └── notifications.ts      # 通知相关操作
├── app/
│   ├── packages/             # 套餐页面
│   └── admin/packages/       # 管理员套餐管理
├── components/
│   └── PackageCard.tsx       # 套餐卡片组件
└── scripts/
    └── migrate-to-packages.ts # 迁移脚本
```

## 🔧 环境配置

确保您的 `.env.local` 文件包含以下变量：

```env
DATABASE_URL="your_postgresql_url"
NEXTAUTH_SECRET="your_secret_key"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (可选)
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# Stripe (可选)
STRIPE_SECRET_KEY="your_stripe_secret_key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your_stripe_publishable_key"
```

## 📚 使用指南

### 管理员操作

1. **创建套餐**
   - 访问 `/admin/packages/new`
   - 填写套餐信息（名称、价格、描述等）
   - 上传图片
   - 编写Markdown内容
   - 设置库存和分类

2. **管理订单**
   - 访问 `/admin/orders`
   - 查看所有订单
   - 确认/取消订单
   - 发送通知

### 用户操作

1. **浏览套餐**
   - 访问 `/packages`
   - 使用搜索和筛选功能
   - 查看套餐详情

2. **购买套餐**
   - 点击"立即购买"
   - 填写收货信息
   - 确认订单

## 🚧 待完善功能

- [ ] 套餐详情页面
- [ ] 支付集成
- [ ] 图片上传功能
- [ ] Markdown编辑器
- [ ] 邮件通知
- [ ] 库存预警

## 📞 支持

如果您在使用过程中遇到问题，请查看：

1. 检查数据库连接
2. 确保已运行迁移脚本
3. 查看控制台错误信息
4. 参考 `PACKAGE_SYSTEM_REFACTOR.md` 了解详细变更

## 📝 更新日志

- **v1.0.0** - 初始版本，包含基本的套餐购买功能
- 从汽车租赁系统重构而来
- 支持套餐管理、订单处理、通知系统