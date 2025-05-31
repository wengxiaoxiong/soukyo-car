# Soukuo Motors Web

## Prisma


### 生产
```bash
npx dotenv -e .env.production -- pnpm prisma studio
```

### 本地测试
```bash
pnpm prisma studio
```


汽车租赁网站项目

## 功能特性

### 店面管理系统
- ✅ 店面数据库化存储
- ✅ 后台管理界面（/admin/stores）
- ✅ 支持添加、编辑、删除店面
- ✅ 支持Google Maps链接和经纬度坐标
- ✅ 营业时间配置（JSON格式）
- ✅ 店面状态管理（激活/停用）
- ✅ 前端自动从数据库获取店面数据

### 数据库初始化

运行以下命令初始化店面数据：

```bash
pnpm seed-stores
```

这将清空现有店面数据并添加以下店面：
- 成田机场店
- 上池袋店  
- 八潮南店(本店)

### 管理后台

访问 `/admin/stores` 可以：
- 查看所有店面列表
- 添加新店面
- 编辑现有店面信息
- 切换店面营业状态
- 删除店面

### 前端展示

- 主页自动显示所有激活状态的店面
- 支持导航功能（优先使用Google Maps链接，备用经纬度坐标）
- 显示营业时间、联系电话等信息
- 响应式设计，支持移动端滑动查看

## 开发

```bash
# 安装依赖
pnpm install

# 初始化店面数据
pnpm seed-stores

# 启动开发服务器
pnpm dev
```

## 技术栈

- Next.js 15
- Prisma (PostgreSQL)
- Tailwind CSS
- shadcn/ui
- TypeScript

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
