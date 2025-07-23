import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedPackages() {
  try {
    // 清空现有套餐数据（可选）
    await prisma.packageReview.deleteMany()
    await prisma.package.deleteMany()

    const packages = [
      {
        name: '东京都市探索套餐',
        description: '专为初次访问东京的游客设计，包含热门景点和文化体验',
        content: `
## 套餐详情

### 包含服务
- 3天2夜东京市区租车服务
- 专业中文导游服务
- 浅草寺、东京塔、银座购物区游览
- 传统日式料理体验
- 24小时客服支持

### 行程安排
**第一天**: 浅草寺 → 东京塔 → 银座购物
**第二天**: 新宿 → 涩谷 → 原宿
**第三天**: 皇居外苑 → 上野公园 → 秋叶原

### 特色亮点
- 深度体验东京传统与现代文化
- 专业导游带您发现隐藏景点
- 灵活的行程安排
- 全程中文服务

### 注意事项
- 需提前3天预订
- 包含基础保险
- 不含住宿和部分餐饮
        `,
        images: [
          'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
          'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800',
          'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800'
        ],
        price: 28800,
        stock: 20,
        isActive: true,
        isFeatured: true
      },
      {
        name: '富士山周边自驾游套餐',
        description: '探索日本象征富士山周边的自然美景和温泉文化',
        content: `
## 套餐详情

### 包含服务
- 4天3夜SUV租车服务
- 富士五湖地区游览
- 河口湖温泉酒店住宿
- 富士山五合目登山体验
- 专业摄影指导

### 行程安排
**第一天**: 东京出发 → 河口湖 → 温泉体验
**第二天**: 富士山五合目 → 忍野八海
**第三天**: 山中湖 → 御殿场奥特莱斯
**第四天**: 箱根 → 返回东京

### 特色亮点
- 360度欣赏富士山美景
- 正宗日式温泉体验
- 专业摄影师指导拍摄
- 品尝当地特色美食

### 注意事项
- 季节性套餐，需确认天气
- 包含温泉酒店住宿
- 登山装备需自备
        `,
        images: [
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
          'https://images.unsplash.com/photo-1576866209830-589e1bfbaa4d?w=800',
          'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=800'
        ],
        price: 45600,
        stock: 15,
        isActive: true,
        isFeatured: true
      },
      {
        name: '关西古都文化之旅',
        description: '深度体验京都、奈良、大阪的传统文化和历史魅力',
        content: `
## 套餐详情

### 包含服务
- 5天4夜关西地区租车
- 京都传统旅馆住宿体验
- 茶道和花道文化体验
- 奈良公园与鹿互动
- 大阪美食导览

### 行程安排
**第一天**: 大阪城 → 道顿堀美食街
**第二天**: 京都清水寺 → 祇园古街
**第三天**: 金阁寺 → 岚山竹林
**第四天**: 奈良公园 → 东大寺
**第五天**: 大阪环球影城

### 特色亮点
- 住宿传统日式旅馆
- 参与正宗茶道仪式
- 与奈良小鹿亲密接触
- 品尝关西地道美食

### 注意事项
- 文化体验需预约
- 包含传统旅馆住宿
- 环球影城门票另计
        `,
        images: [
          'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800',
          'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800',
          'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800'
        ],
        price: 52000,
        stock: 12,
        isActive: true,
        isFeatured: true
      },
      {
        name: '北海道雪国风情套餐',
        description: '冬季限定，体验北海道的雪景、温泉和海鲜美食',
        content: `
## 套餐详情

### 包含服务
- 6天5夜四驱车租车服务
- 札幌、小樽、函館游览
- 登别温泉住宿体验
- 雪上活动体验
- 海鲜市场导览

### 行程安排
**第一天**: 札幌雪祭会场
**第二天**: 小樽运河 → 玻璃工艺体验
**第三天**: 登别地狱谷 → 温泉体验
**第四天**: 函馆朝市 → 函馆山夜景
**第五天**: 洞爷湖 → 雪上活动
**第六天**: 新千岁机场购物

### 特色亮点
- 冬季限定雪景体验
- 正宗北海道海鲜
- 世界知名温泉体验
- 雪上摩托等活动

### 注意事项
- 仅限冬季12月-3月
- 需要雪地驾驶经验
- 包含温泉酒店住宿
        `,
        images: [
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
          'https://images.unsplash.com/photo-1551524164-6cf6ac833fb0?w=800',
          'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800'
        ],
        price: 68000,
        stock: 8,
        isActive: true,
        isFeatured: false
      },
      {
        name: '九州温泉美食之旅',
        description: '享受九州地区的天然温泉、火山景观和特色料理',
        content: `
## 套餐详情

### 包含服务
- 4天3夜九州租车服务
- 别府、由布院温泉体验
- 熊本城、阿苏火山游览
- 博多拉面制作体验
- 温泉旅馆住宿

### 行程安排
**第一天**: 福冈博多 → 拉面制作体验
**第二天**: 别府温泉 → 地狱巡游
**第三天**: 由布院 → 阿苏火山
**第四天**: 熊本城 → 返程

### 特色亮点
- 体验日本最著名温泉
- 亲手制作博多拉面
- 观赏活火山奇观
- 入住高级温泉旅馆

### 注意事项
- 火山活动期间可能调整行程
- 包含温泉旅馆住宿
- 拉面体验需预约
        `,
        images: [
          'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800',
          'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800',
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'
        ],
        price: 39800,
        stock: 18,
        isActive: true,
        isFeatured: false
      },
      {
        name: '冲绳海岛度假套餐',
        description: '享受冲绳碧海蓝天，体验独特的琉球文化',
        content: `
## 套餐详情

### 包含服务
- 3天2夜敞篷车租车
- 海滩度假酒店住宿
- 潜水体验课程
- 琉球文化表演观赏
- 海鲜BBQ晚餐

### 行程安排
**第一天**: 那霸机场 → 国际通购物街
**第二天**: 美丽海水族馆 → 潜水体验
**第三天**: 首里城 → 琉球文化体验

### 特色亮点
- 驾驶敞篷车环岛游
- 世界级海洋馆参观
- 专业潜水教练指导
- 品尝冲绳特色料理

### 注意事项
- 潜水需要健康证明
- 海滩活动看天气情况
- 包含海景酒店住宿
        `,
        images: [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
          'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'
        ],
        price: 36500,
        stock: 25,
        isActive: true,
        isFeatured: true
      }
    ]

    for (const packageData of packages) {
      await prisma.package.create({
        data: packageData
      })
    }

    console.log('套餐数据初始化完成！')
    console.log(`成功创建 ${packages.length} 个套餐`)
  } catch (error) {
    console.error('初始化套餐数据失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedPackages()