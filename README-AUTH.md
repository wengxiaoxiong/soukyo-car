# NextAuth.js 认证系统配置指南

## 🚀 已实现的功能

✅ **完整的NextAuth.js认证系统**
- 邮箱密码登录
- Google OAuth登录
- 用户注册
- 角色权限管理（USER/ADMIN/MANAGER）
- 管理后台权限保护

## 📋 环境变量配置

请在 `.env.local` 文件中添加以下环境变量：

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/soukyo_motors"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## 🔧 Google OAuth 配置步骤

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 Google+ API
4. 创建 OAuth 2.0 客户端 ID
5. 添加授权重定向 URI：`http://localhost:3000/api/auth/callback/google`
6. 复制客户端 ID 和密钥到环境变量

## 🗄️ 数据库迁移

运行以下命令来应用数据库更改：

```bash
# 生成 Prisma 客户端
pnpm prisma generate

# 推送数据库更改（开发环境）
pnpm prisma db push

# 或者创建并运行迁移（生产环境）
pnpm prisma migrate dev --name add-nextauth-tables
```

## 👤 创建管理员用户

运行以下脚本创建默认管理员用户：

```bash
npx tsx scripts/create-admin.ts
```

默认管理员账户：
- 邮箱：`admin@soukyo.com`
- 密码：`admin123`
- 角色：`ADMIN`

## 🔐 认证流程

### 用户注册
1. 访问 `/auth/signup`
2. 填写姓名、邮箱、密码
3. 自动创建 USER 角色用户
4. 注册成功后自动登录

### 用户登录
1. 访问 `/auth/signin`
2. 可选择邮箱密码登录或 Google 登录
3. 登录成功后根据角色跳转：
   - ADMIN/MANAGER → `/admin`
   - USER → `/`

### 权限控制
- `/admin/*` 路由需要 ADMIN 或 MANAGER 角色
- 未登录用户访问管理后台会重定向到登录页
- 普通用户访问管理后台会重定向到首页

## 🎯 测试步骤

1. **启动开发服务器**
   ```bash
   pnpm dev
   ```

2. **测试用户注册**
   - 访问 `http://localhost:3000/auth/signup`
   - 注册新用户

3. **测试管理员登录**
   - 访问 `http://localhost:3000/auth/signin`
   - 使用管理员账户登录
   - 验证能否访问 `/admin`

4. **测试权限控制**
   - 用普通用户登录
   - 尝试访问 `/admin`（应该被重定向到首页）

## 🔄 会话管理

- 使用 JWT 策略存储会话
- 会话包含用户 ID、角色、激活状态
- 支持服务端和客户端会话检查

## 🛡️ 安全特性

- 密码使用 bcrypt 加密存储
- CSRF 保护
- JWT 签名验证
- OAuth 流程安全处理

## 📝 API 路由

- `GET/POST /api/auth/[...nextauth]` - NextAuth.js 处理器
- `POST /api/auth/register` - 用户注册

## 🎨 UI 组件

- 现代化的登录/注册页面
- 响应式设计
- 错误处理和加载状态
- 密码可见性切换

现在您的认证系统已经完全配置好了！🎉 