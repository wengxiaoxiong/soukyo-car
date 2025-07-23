# 数据库i18n迁移指南

## 概述

本指南将帮助你将现有的单语言数据库迁移到支持多语言的数据库结构。我们推荐使用**JSON字段方案**作为最佳实践。

## 为什么选择JSON字段方案？

### 优势
- ✅ **简洁性**: 不需要额外的关联表，schema更简洁
- ✅ **性能**: 减少JOIN查询，提高查询性能
- ✅ **灵活性**: 容易添加新语言，不需要修改schema
- ✅ **PostgreSQL支持**: 充分利用PostgreSQL的JSON功能
- ✅ **类型安全**: 配合TypeScript提供良好的类型支持

### 对比其他方案

| 方案 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| 单表多列 | 查询简单，性能好 | 添加语言需修改schema | 语言固定且较少(2-4种) |
| 关联表 | 高度灵活，易于管理 | 查询复杂，性能较差 | 语言很多，需要复杂权限控制 |
| **JSON字段** | **平衡性能和灵活性** | **需要PostgreSQL 9.2+** | **推荐用于大多数场景** |

## 迁移步骤

### 第一步：备份现有数据

```bash
# 备份数据库
pg_dump your_database > backup_before_i18n_migration.sql
```

### 第二步：创建新的schema

1. 修改 `prisma/schema.prisma`，将需要多语言的字段改为JSON类型：

```prisma
// 原来的单语言字段
model Store {
  name        String
  description String?
}

// 改为多语言JSON字段
model Store {
  name        Json     // { "zh": "北京店", "en": "Beijing Store", "ja": "北京店" }
  description Json?    // { "zh": "描述", "en": "Description", "ja": "説明" }
}
```

### 第三步：创建数据迁移脚本

创建 `scripts/migrate-to-i18n.ts`:

```typescript
import { PrismaClient } from '@prisma/client'
import { DatabaseI18n } from '@/lib/i18n-db'

const prisma = new PrismaClient()

async function migrateToI18n() {
  console.log('开始迁移数据库到i18n格式...')

  try {
    // 1. 迁移Store表
    console.log('迁移Store表...')
    const stores = await prisma.store.findMany()
    
    for (const store of stores) {
      await prisma.store.update({
        where: { id: store.id },
        data: {
          name: DatabaseI18n.createI18nData({ zh: store.name }),
          description: store.description 
            ? DatabaseI18n.createI18nData({ zh: store.description })
            : {}
        }
      })
    }
    console.log(`✅ 迁移了 ${stores.length} 个店面`)

    // 2. 迁移Vehicle表
    console.log('迁移Vehicle表...')
    const vehicles = await prisma.vehicle.findMany()
    
    for (const vehicle of vehicles) {
      await prisma.vehicle.update({
        where: { id: vehicle.id },
        data: {
          name: DatabaseI18n.createI18nData({ zh: vehicle.name }),
          description: vehicle.description 
            ? DatabaseI18n.createI18nData({ zh: vehicle.description })
            : {},
          internalDescription: vehicle.internalDescription
            ? DatabaseI18n.createI18nData({ zh: vehicle.internalDescription })
            : {}
        }
      })
    }
    console.log(`✅ 迁移了 ${vehicles.length} 个车辆`)

    // 3. 迁移News表
    console.log('迁移News表...')
    const news = await prisma.news.findMany()
    
    for (const article of news) {
      await prisma.news.update({
        where: { id: article.id },
        data: {
          title: DatabaseI18n.createI18nData({ zh: article.title }),
          content: DatabaseI18n.createI18nData({ zh: article.content }),
          summary: article.summary 
            ? DatabaseI18n.createI18nData({ zh: article.summary })
            : {},
          metaTitle: article.metaTitle
            ? DatabaseI18n.createI18nData({ zh: article.metaTitle })
            : {},
          metaDescription: article.metaDescription
            ? DatabaseI18n.createI18nData({ zh: article.metaDescription })
            : {}
        }
      })
    }
    console.log(`✅ 迁移了 ${news.length} 个新闻`)

    // 4. 迁移Package表
    console.log('迁移Package表...')
    const packages = await prisma.package.findMany()
    
    for (const pkg of packages) {
      await prisma.package.update({
        where: { id: pkg.id },
        data: {
          name: DatabaseI18n.createI18nData({ zh: pkg.name }),
          description: pkg.description 
            ? DatabaseI18n.createI18nData({ zh: pkg.description })
            : {},
          content: pkg.content
            ? DatabaseI18n.createI18nData({ zh: pkg.content })
            : {}
        }
      })
    }
    console.log(`✅ 迁移了 ${packages.length} 个套餐`)

    // 5. 迁移Notification表
    console.log('迁移Notification表...')
    const notifications = await prisma.notification.findMany()
    
    for (const notification of notifications) {
      await prisma.notification.update({
        where: { id: notification.id },
        data: {
          title: DatabaseI18n.createI18nData({ zh: notification.title }),
          message: DatabaseI18n.createI18nData({ zh: notification.message })
        }
      })
    }
    console.log(`✅ 迁移了 ${notifications.length} 个通知`)

    console.log('🎉 数据库i18n迁移完成！')
  } catch (error) {
    console.error('❌ 迁移失败:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

migrateToI18n()
```

### 第四步：执行迁移

```bash
# 1. 生成新的Prisma客户端
npx prisma generate

# 2. 应用数据库schema变更
npx prisma db push

# 3. 运行数据迁移脚本
npx tsx scripts/migrate-to-i18n.ts
```

### 第五步：更新应用代码

1. **更新API路由**:

```typescript
// 原来的代码
export async function getStores() {
  return await prisma.store.findMany({
    where: { isActive: true }
  })
}

// 更新后的代码
import { DatabaseI18n } from '@/lib/i18n-db'

export async function getStores(locale: SupportedLocale = 'zh') {
  const stores = await prisma.store.findMany({
    where: { isActive: true },
    orderBy: DatabaseI18n.createI18nOrderBy(locale, 'name')
  })

  return stores.map(store => ({
    ...store,
    name: DatabaseI18n.getText(store.name, locale),
    description: DatabaseI18n.getText(store.description, locale)
  }))
}
```

2. **更新React组件**:

```tsx
// 原来的代码
function StoreCard({ store }) {
  return (
    <div>
      <h3>{store.name}</h3>
      <p>{store.description}</p>
    </div>
  )
}

// 更新后的代码
import { useDbI18n } from '@/lib/i18n-db'
import { useLocale } from 'next-intl'

function StoreCard({ store }) {
  const locale = useLocale()
  const { getText } = useDbI18n(locale)

  return (
    <div>
      <h3>{getText(store.name)}</h3>
      <p>{getText(store.description)}</p>
    </div>
  )
}
```

### 第六步：添加翻译内容

使用管理界面或脚本添加其他语言的翻译：

```typescript
// 示例：添加英文和日文翻译
await updateStoreTranslation('store-id', 'en', {
  name: 'Beijing Store',
  description: 'Premium car rental store in Beijing'
})

await updateStoreTranslation('store-id', 'ja', {
  name: '北京店',
  description: '北京のプレミアムレンタカー店'
})
```

## 最佳实践

### 1. 数据验证

定期运行数据完整性检查：

```typescript
// 检查缺失的翻译
const issues = await validateI18nDataIntegrity()
if (issues.length > 0) {
  console.warn('发现多语言数据问题:', issues)
}
```

### 2. 性能优化

- 为JSON字段创建索引（如果需要频繁搜索）
- 使用适当的查询策略避免过度获取数据
- 考虑在应用层缓存翻译内容

### 3. 内容管理

- 建立翻译工作流程
- 使用版本控制管理翻译内容
- 考虑集成专业翻译服务

### 4. 错误处理

- 总是提供fallback语言
- 优雅处理缺失的翻译
- 记录翻译相关的错误

## 回滚计划

如果需要回滚到单语言版本：

```typescript
// 回滚脚本示例
async function rollbackI18n() {
  const stores = await prisma.store.findMany()
  
  for (const store of stores) {
    const chineseName = DatabaseI18n.getText(store.name, 'zh')
    const chineseDesc = DatabaseI18n.getText(store.description, 'zh')
    
    await prisma.store.update({
      where: { id: store.id },
      data: {
        name: chineseName,
        description: chineseDesc
      }
    })
  }
}
```

## 监控和维护

### 1. 监控指标
- 翻译完整性比例
- 各语言的使用频率
- 查询性能指标

### 2. 定期任务
- 检查缺失的翻译
- 更新机器翻译
- 清理无用的翻译数据

### 3. 用户反馈
- 提供翻译质量反馈机制
- 收集用户对多语言功能的意见
- 持续改进翻译质量

## 总结

通过采用JSON字段方案，你可以：

1. **快速实现**: 最少的schema变更，快速上线多语言功能
2. **良好性能**: 利用PostgreSQL的JSON功能，保持查询性能
3. **易于维护**: 统一的工具类和Hook，简化开发和维护
4. **可扩展性**: 容易添加新语言，支持未来需求

记住，数据库i18n不仅仅是技术实现，还需要考虑内容管理、翻译工作流程和用户体验等方面。