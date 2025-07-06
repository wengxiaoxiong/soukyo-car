import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Package, Plus, Search, MapPin, Edit, Trash2, Eye, EyeOff, Star } from 'lucide-react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { togglePackageStatus, deletePackage } from '@/lib/actions/packages'

async function getPackages() {
  try {
    const packages = await prisma.package.findMany({
      include: {
        store: {
          select: {
            id: true,
            name: true,
            city: true,
            address: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return packages
  } catch (error) {
    console.error('获取套餐列表失败:', error)
    return []
  }
}

export default async function AdminPackagesPage() {
  const packages = await getPackages()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">套餐管理</h1>
          <p className="text-gray-600 mt-2">管理系统中的所有套餐</p>
        </div>
        <Link href="/admin/packages/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            添加套餐
          </Button>
        </Link>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">总套餐数</p>
              <p className="text-2xl font-bold text-gray-900">{packages.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">活跃套餐</p>
              <p className="text-2xl font-bold text-gray-900">
                {packages.filter(pkg => pkg.isActive).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">推荐套餐</p>
              <p className="text-2xl font-bold text-gray-900">
                {packages.filter(pkg => pkg.isFeatured).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-orange-100">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">总库存</p>
              <p className="text-2xl font-bold text-gray-900">
                {packages.reduce((sum, pkg) => sum + pkg.stock, 0)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* 套餐列表 */}
      <Card>
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">套餐列表</h3>
        </div>
        
        {packages.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    套餐信息
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    门店
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    价格
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    库存
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {packages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {pkg.images.length > 0 ? (
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={pkg.images[0]}
                              alt={pkg.name}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{pkg.name}</div>
                          <div className="text-sm text-gray-500 line-clamp-2">
                            {pkg.description || '暂无描述'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900">{pkg.store.name}</span>
                      </div>
                      <div className="text-sm text-gray-500">{pkg.store.city}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ¥{pkg.price.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{pkg.stock}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Badge variant={pkg.isActive ? 'default' : 'secondary'}>
                          {pkg.isActive ? '活跃' : '停用'}
                        </Badge>
                        {pkg.isFeatured && (
                          <Badge variant="outline" className="text-purple-600 border-purple-600">
                            推荐
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/packages/${pkg.id}`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        
                        <form action={togglePackageStatus.bind(null, pkg.id)}>
                          <Button
                            type="submit"
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {pkg.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </form>
                        
                        <form action={deletePackage.bind(null, pkg.id)}>
                          <Button
                            type="submit"
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-800"
                            onClick={(e) => {
                              if (!confirm('确定要删除这个套餐吗？')) {
                                e.preventDefault()
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-24 h-24 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">暂无套餐</h3>
            <p className="text-gray-600 mb-6">开始创建您的第一个套餐</p>
            <Link href="/admin/packages/new">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                添加套餐
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  )
}