import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Car, MapPin, DollarSign, Users, Palette, Hash } from 'lucide-react'
import { VehicleActions } from '@/components/admin/VehicleActions'
import { getVehicles } from './actions'

export default async function VehiclesPage() {
  const vehicles = await getVehicles()

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">车辆管理</h1>
          <p className="text-gray-600 mt-2">管理所有车辆信息</p>
        </div>
        <Link href="/admin/vehicles/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            添加车辆
          </Button>
        </Link>
      </div>

      {vehicles.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-gray-500">
            <Car className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">暂无车辆</h3>
            <p className="mb-4">开始添加您的第一辆车辆</p>
            <Link href="/admin/vehicles/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                添加车辆
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} className="overflow-hidden pt-0">
              {vehicle.images && vehicle.images.length > 0 && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={vehicle.images[0]}
                    alt={vehicle.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {vehicle.name}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge variant={vehicle.isAvailable ? 'default' : 'secondary'}>
                        {vehicle.isAvailable ? '可用' : '不可用'}
                      </Badge>
                      <Badge variant="outline">
                        {vehicle.brand} {vehicle.model}
                      </Badge>
                    </div>
                  </div>
                  <VehicleActions vehicleId={vehicle.id} />
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{vehicle.store.name} ({vehicle.store.city})</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>${vehicle.pricePerDay}/天</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{vehicle.seats}座</span>
                  </div>
                  <div className="flex items-center">
                    <Car className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{vehicle.year}年</span>
                  </div>
                  {vehicle.color && (
                    <div className="flex items-center">
                      <Palette className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{vehicle.color}</span>
                    </div>
                  )}
                  {vehicle.plateNumber && (
                    <div className="flex items-center">
                      <Hash className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{vehicle.plateNumber}</span>
                    </div>
                  )}
                </div>

                {vehicle.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {vehicle.description}
                  </p>
                )}

                <div className="flex gap-2">
                  <Link href={`/admin/vehicles/${vehicle.id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="w-4 h-4 mr-2" />
                      编辑
                    </Button>
                  </Link>
                  <Link href={`/admin/vehicles/${vehicle.id}`} className="flex-1">
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