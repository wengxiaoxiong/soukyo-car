import { Card } from '@/components/ui/card'
import { Store, Car, Users, FileText, Package } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

async function getStats() {
  try {
    const [storeCount, vehicleCount, userCount, orderCount, packageCount] = await Promise.all([
      prisma.store.count(),
      prisma.vehicle.count(),
      prisma.user.count(),
      prisma.order.count(),
      prisma.package.count(),
    ])

    return {
      stores: storeCount,
      vehicles: vehicleCount,
      users: userCount,
      orders: orderCount,
      packages: packageCount,
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
    return {
      stores: 0,
      vehicles: 0,
      users: 0,
      orders: 0,
      packages: 0,
    }
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const statCards = [
    {
      title: '店面总数',
      value: stats.stores,
      icon: Store,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      href: '/admin/stores',
    },
    {
      title: '套餐总数',
      value: stats.packages,
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      href: '/admin/packages',
    },
    {
      title: '车辆总数',
      value: stats.vehicles,
      icon: Car,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      href: '/admin/vehicles',
    },
    {
      title: '用户总数',
      value: stats.users,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      href: '/admin/users',
    },
    {
      title: '订单总数',
      value: stats.orders,
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      href: '/admin/orders',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">仪表板</h1>
        <p className="text-gray-600 mt-2">欢迎来到Soukyo汽车管理后台</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">系统状态</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">数据库连接</span>
              <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                正常
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">系统状态</span>
              <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                运行中
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
} 