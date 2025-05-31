import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedStores() {
  try {
    // 清空现有数据（可选）
    await prisma.store.deleteMany()

    const stores = [
      {
        name: '成田机场店',
        address: '千葉県成田市吉岡1124-76',
        city: '成田市',
        state: '千葉県',
        phone: '070-6662-0288',
        image: 'https://ai-public.mastergo.com/ai/img_res/cdf485d92b8e70859685cbb1dc683192.jpg',
        googleMap: 'https://maps.app.goo.gl/RSsyqRxTzznHJvKG9',
        openingHours: {
          monday: '8:00-20:00',
          tuesday: '8:00-20:00',
          wednesday: '8:00-20:00',
          thursday: '8:00-20:00',
          friday: '8:00-20:00',
          saturday: '8:00-20:00',
          sunday: '8:00-20:00'
        },
        latitude: 35.8056642,
        longitude: 140.404345,
        description: '位于成田机场附近，方便旅客取车还车'
      },
      {
        name: '上池袋店',
        address: '東京都豊島区上池袋4丁目3−5恩田ビル1F',
        city: '豊島区',
        state: '東京都',
        phone: '080-4612-0188',
        image: 'https://ai-public.mastergo.com/ai/img_res/3152122a6fdd97d2f37d6054f81a3e61.jpg',
        googleMap: 'https://maps.app.goo.gl/KpNdfC4qmFzLm3bV8',
        openingHours: {
          monday: '8:00-20:00',
          tuesday: '8:00-20:00',
          wednesday: '8:00-20:00',
          thursday: '8:00-20:00',
          friday: '8:00-20:00',
          saturday: '8:00-20:00',
          sunday: '8:00-20:00'
        },
        latitude: 35.739826,
        longitude: 139.7212577,
        description: '位于池袋商圈，交通便利'
      },
      {
        name: '八潮南店(本店)',
        address: '埼玉県八潮市大字大曽根705-1',
        city: '八潮市',
        state: '埼玉県',
        phone: '048-951-1089',
        image: 'https://ai-public.mastergo.com/ai/img_res/0ac5ab1537398847b6ba818693d78968.jpg',
        googleMap: 'https://maps.app.goo.gl/J4uZen55aFBZBsyy5',
        openingHours: {
          monday: '10:00-19:00',
          tuesday: '10:00-19:00',
          wednesday: '10:00-19:00',
          thursday: '10:00-19:00',
          friday: '10:00-19:00',
          saturday: '10:00-19:00',
          sunday: '10:00-19:00'
        },
        latitude: 35.8043808,
        longitude: 139.8298957,
        description: '总店，提供全方位的租车服务'
      }
    ]

    for (const store of stores) {
      await prisma.store.create({
        data: store
      })
    }

    console.log('店面数据初始化完成！')
  } catch (error) {
    console.error('初始化店面数据失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedStores()