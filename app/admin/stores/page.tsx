import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, MapPin, Phone, Mail } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { StoreActions } from '@/components/admin/StoreActions'

async function getStores() {
  try {
    const stores = await prisma.store.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: {
            vehicles: true,
            orders: true,
          },
        },
      },
    })
    return stores
  } catch (error) {
    console.error('获取店面列表失败:', error)
    return []
  }
}

export default async function StoresPage() {
  const stores = await getStores()

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">店面管理</h1>
          <p className="text-gray-600 mt-2">管理所有店面信息</p>
        </div>
        <Link href="/admin/stores/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            添加店面
          </Button>
        </Link>
      </div>

      {stores.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-gray-500">
            <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">暂无店面</h3>
            <p className="mb-4">开始添加您的第一个店面</p>
            <Link href="/admin/stores/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                添加店面
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <Card key={store.id} className="overflow-hidden">
              {store.image && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={store.image}
                    alt={store.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {store.name}
                    </h3>
                    <Badge variant={store.isActive ? 'default' : 'secondary'}>
                      {store.isActive ? '营业中' : '已关闭'}
                    </Badge>
                  </div>
                  <StoreActions storeId={store.id} />
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
                    <span>{store.address}, {store.city}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{store.phone}</span>
                  </div>
                  {store.email && (
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{store.email}</span>
                    </div>
                  )}
                </div>

                {store.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {store.description}
                  </p>
                )}

                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>车辆: {store._count.vehicles}</span>
                  <span>订单: {store._count.orders}</span>
                </div>

                <div className="flex gap-2">
                  <Link href={`/admin/stores/${store.id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="w-4 h-4 mr-2" />
                      编辑
                    </Button>
                  </Link>
                  <Link href={`/admin/stores/${store.id}`} className="flex-1">
                    <Button size="sm" className="w-full">
                      查看详情
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 