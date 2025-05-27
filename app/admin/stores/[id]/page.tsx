import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, MapPin, Phone, Mail, Globe } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { StoreActions } from '@/components/admin/StoreActions'

async function getStore(id: string) {
  try {
    const store = await prisma.store.findUnique({
      where: { id },
      include: {
        vehicles: {
          select: {
            id: true,
            name: true,
            brand: true,
            model: true,
            isAvailable: true,
          },
        },
        orders: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            totalAmount: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
        _count: {
          select: {
            vehicles: true,
            orders: true,
          },
        },
      },
    })
    return store
  } catch (error) {
    console.error('获取店面详情失败:', error)
    return null
  }
}

export default async function StoreDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const store = await getStore(params.id)

  if (!store) {
    notFound()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/admin/stores">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回列表
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{store.name}</h1>
            <p className="text-gray-600 mt-2">店面详细信息</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={store.isActive ? 'default' : 'secondary'}>
            {store.isActive ? '营业中' : '已关闭'}
          </Badge>
          <Link href={`/admin/stores/${store.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              编辑
            </Button>
          </Link>
          <StoreActions storeId={store.id} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 基本信息 */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">基本信息</h2>
            {store.image && (
              <div className="mb-6">
                <img
                  src={store.image}
                  alt={store.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">联系信息</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>{store.phone}</span>
                  </div>
                  {store.email && (
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      <span>{store.email}</span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">地址信息</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <div>{store.address}</div>
                      <div>{store.city}{store.state ? `, ${store.state}` : ''} {store.zipCode || ''}</div>
                    </div>
                  </div>
                  {(store.latitude && store.longitude) && (
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-2" />
                      <span>纬度: {store.latitude}, 经度: {store.longitude}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {store.description && (
              <div className="mt-6">
                <h3 className="font-medium text-gray-900 mb-2">店面描述</h3>
                <p className="text-sm text-gray-600">{store.description}</p>
              </div>
            )}
            {store.openingHours && (
              <div className="mt-6">
                <h3 className="font-medium text-gray-900 mb-2">营业时间</h3>
                <div className="text-sm text-gray-600">
                  <pre className="whitespace-pre-wrap font-mono text-xs bg-gray-50 p-3 rounded">
                    {JSON.stringify(store.openingHours, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </Card>

          {/* 车辆列表 */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">车辆列表</h2>
              <span className="text-sm text-gray-500">共 {store._count.vehicles} 辆</span>
            </div>
            {store.vehicles.length === 0 ? (
              <p className="text-gray-500 text-center py-8">暂无车辆</p>
            ) : (
              <div className="space-y-3">
                {store.vehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">{vehicle.name}</h4>
                      <p className="text-sm text-gray-600">{vehicle.brand} {vehicle.model}</p>
                    </div>
                    <Badge variant={vehicle.isAvailable ? 'default' : 'secondary'}>
                      {vehicle.isAvailable ? '可用' : '不可用'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* 统计信息 */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">统计信息</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">车辆总数</span>
                <span className="font-semibold text-gray-900">{store._count.vehicles}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">订单总数</span>
                <span className="font-semibold text-gray-900">{store._count.orders}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">创建时间</span>
                <span className="text-sm text-gray-600">
                  {new Date(store.createdAt).toLocaleDateString('zh-CN')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">更新时间</span>
                <span className="text-sm text-gray-600">
                  {new Date(store.updatedAt).toLocaleDateString('zh-CN')}
                </span>
              </div>
            </div>
          </Card>

          {/* 最近订单 */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">最近订单</h2>
            {store.orders.length === 0 ? (
              <p className="text-gray-500 text-center py-4">暂无订单</p>
            ) : (
              <div className="space-y-3">
                {store.orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{order.orderNumber}</span>
                      <Badge variant="outline">{order.status}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>¥{order.totalAmount}</span>
                      <span>{new Date(order.createdAt).toLocaleDateString('zh-CN')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
} 