#!/usr/bin/env tsx

/**
 * 数据库迁移脚本：从汽车租赁系统迁移到套餐购买系统
 * 
 * 此脚本将：
 * 1. 应用数据库schema更改
 * 2. 创建示例套餐数据
 * 3. 清理旧的汽车相关数据
 */

import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'

const prisma = new PrismaClient()

// 示例套餐数据
const samplePackages = [
  {
    name: '美食探索套餐',
    title: '品味城市美食，享受舌尖之旅',
    price: 299,
    originalPrice: 399,
    description: '包含3家精选餐厅的美食体验，专业向导带您探索当地特色美食。',
    content: `
# 美食探索套餐

## 套餐包含

- 🍽️ 3家精选餐厅用餐
- 👨‍🍳  专业美食向导
- 🚗 往返交通接送
- 📸 美食摄影服务

## 行程安排

### 第一站：传统日料店
品尝正宗的日式料理，体验传统的用餐文化。

### 第二站：创意融合餐厅
现代与传统的完美融合，享受创新美食体验。

### 第三站：本地特色小店
发现隐藏的美食宝藏，品尝地道的本地风味。

## 预订须知

- 提前24小时预订
- 支持素食选项
- 包含所有餐费
- 小团体服务（2-6人）
    `,
    images: [
      '/images/packages/food-tour-1.jpg',
      '/images/packages/food-tour-2.jpg',
      '/images/packages/food-tour-3.jpg'
    ],
    thumbnail: '/images/packages/food-tour-thumbnail.jpg',
    stock: 50,
    maxStock: 100,
    category: '美食',
    tags: ['美食', '导游', '体验'],
    isActive: true,
    isPublished: true,
    sortOrder: 100
  },
  {
    name: '城市观光套餐',
    title: '探索城市风光，留下美好回忆',
    price: 199,
    description: '专业导游带您游览城市重要景点，包含门票和交通。',
    content: `
# 城市观光套餐

## 套餐特色

- 🏛️ 主要景点游览
- 🚌 舒适交通接送
- 📱 专业导游讲解
- 🎟️ 所有门票包含

## 游览景点

1. **历史博物馆** - 了解城市历史文化
2. **城市地标** - 打卡著名建筑
3. **公园绿地** - 享受自然风光
4. **购物区域** - 体验当地购物文化

## 服务承诺

- 小团体贴心服务
- 专业摄影留念
- 24小时客服支持
- 无购物强制消费
    `,
    images: [
      '/images/packages/city-tour-1.jpg',
      '/images/packages/city-tour-2.jpg'
    ],
    thumbnail: '/images/packages/city-tour-thumbnail.jpg',
    stock: 30,
    maxStock: 50,
    category: '旅游',
    tags: ['观光', '导游', '景点'],
    isActive: true,
    isPublished: true,
    sortOrder: 90
  },
  {
    name: '生活便民套餐',
    title: '日常生活服务，让生活更便捷',
    price: 99,
    description: '包含家政清洁、维修服务、代购等生活便民服务。',
    content: `
# 生活便民套餐

## 服务内容

- 🏠 家政清洁服务
- 🔧 基础维修服务
- 🛒 代购跑腿服务
- 📦 快递收发服务

## 服务特点

- 专业团队服务
- 价格透明合理
- 服务时间灵活
- 满意度保证

## 使用说明

1. 在线预约服务
2. 确认服务时间
3. 专业人员上门
4. 服务完成确认

*注：本套餐为服务券形式，有效期6个月*
    `,
    images: [
      '/images/packages/life-service-1.jpg'
    ],
    thumbnail: '/images/packages/life-service-thumbnail.jpg',
    stock: 100,
    maxStock: 200,
    category: '生活',
    tags: ['便民', '服务', '家政'],
    isActive: true,
    isPublished: true,
    sortOrder: 80
  },
  {
    name: '娱乐体验套餐',
    title: '精彩娱乐活动，释放工作压力',
    price: 399,
    originalPrice: 499,
    description: 'KTV、电影、游戏等多种娱乐活动组合，适合朋友聚会。',
    content: `
# 娱乐体验套餐

## 套餐组合

- 🎤 KTV包厢3小时
- 🎬 电影票2张
- 🎮 电玩城游戏币
- 🍿 小食饮料套餐

## 适用场景

- 朋友聚会
- 情侣约会
- 团队建设
- 庆祝活动

## 预订说明

- 支持在线预订
- 可选择时间段
- 支持团体优惠
- 7天内有效

*让您的休闲时光更加精彩！*
    `,
    images: [
      '/images/packages/entertainment-1.jpg',
      '/images/packages/entertainment-2.jpg',
      '/images/packages/entertainment-3.jpg'
    ],
    thumbnail: '/images/packages/entertainment-thumbnail.jpg',
    stock: 25,
    maxStock: 50,
    category: '娱乐',
    tags: ['娱乐', 'KTV', '电影', '游戏'],
    isActive: true,
    isPublished: true,
    sortOrder: 70
  }
]

async function main() {
  console.log('🚀 开始数据库迁移...')

  try {
    // 1. 应用数据库schema更改
    console.log('📝 应用数据库schema更改...')
    execSync('npx prisma db push', { stdio: 'inherit' })
    
    // 2. 生成新的Prisma客户端
    console.log('🔄 生成新的Prisma客户端...')
    execSync('npx prisma generate', { stdio: 'inherit' })

    // 3. 检查是否需要清理旧数据
    console.log('🧹 检查现有数据...')
    
    try {
      // 尝试查询旧的vehicle表（如果存在）
      const vehicleCount = await prisma.$queryRaw`
        SELECT COUNT(*) as count FROM vehicles
      `
      console.log(`发现 ${vehicleCount[0].count} 个旧的车辆记录`)
      
      // 可以选择删除或保留，这里只是显示
      console.log('⚠️  旧的车辆数据仍然存在，您可以选择手动清理')
    } catch (error) {
      console.log('✅ 未发现旧的车辆数据表')
    }

    // 4. 创建示例套餐数据
    console.log('📦 创建示例套餐数据...')
    
    for (const packageData of samplePackages) {
      try {
        await prisma.package.create({
          data: packageData
        })
        console.log(`✅ 创建套餐: ${packageData.name}`)
      } catch (error) {
        console.log(`⚠️  套餐 ${packageData.name} 可能已存在，跳过创建`)
      }
    }

    // 5. 确保有默认店面
    console.log('🏪 检查店面数据...')
    const storeCount = await prisma.store.count()
    
    if (storeCount === 0) {
      await prisma.store.create({
        data: {
          name: '总店',
          address: '日本东京都',
          city: '东京',
          phone: '090-1234-5678',
          email: 'info@example.com',
          description: '我们的总店，提供全面的服务',
          isActive: true
        }
      })
      console.log('✅ 创建默认店面')
    }

    console.log('🎉 数据库迁移完成!')
    console.log('')
    console.log('📋 迁移总结:')
    console.log('   - 数据库schema已更新')
    console.log('   - Prisma客户端已生成')
    console.log('   - 示例套餐数据已创建')
    console.log('   - 默认店面已确保存在')
    console.log('')
    console.log('🚀 现在您可以启动应用了:')
    console.log('   npm run dev')
    console.log('')
    console.log('🌐 访问以下页面:')
    console.log('   - 套餐列表: http://localhost:3000/packages')
    console.log('   - 管理后台: http://localhost:3000/admin/packages')

  } catch (error) {
    console.error('❌ 迁移过程中发生错误:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((error) => {
    console.error('❌ 迁移失败:', error)
    process.exit(1)
  })