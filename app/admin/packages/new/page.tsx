import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Upload, Plus, X } from 'lucide-react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { createPackage } from '@/lib/actions/packages'

async function getStores() {
  try {
    const stores = await prisma.store.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        city: true,
        address: true
      },
      orderBy: {
        name: 'asc'
      }
    })
    return stores
  } catch (error) {
    console.error('获取门店列表失败:', error)
    return []
  }
}

export default async function NewPackagePage() {
  const stores = await getStores()

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/packages">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回套餐管理
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">添加新套餐</h1>
          <p className="text-gray-600 mt-2">创建一个新的套餐产品</p>
        </div>
      </div>

      <Card className="max-w-4xl">
        <form action={createPackage} className="p-6 space-y-6">
          {/* 基本信息 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">基本信息</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">套餐名称 *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="请输入套餐名称"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="storeId">关联门店 *</Label>
                <Select name="storeId" required>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="选择门店" />
                  </SelectTrigger>
                  <SelectContent>
                    {stores.map((store) => (
                      <SelectItem key={store.id} value={store.id}>
                        {store.name} - {store.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">套餐描述</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="请输入套餐描述"
                rows={3}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="content">详细内容 (Markdown)</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="请输入套餐的详细内容，支持Markdown格式"
                rows={6}
                className="mt-1 font-mono"
              />
              <p className="text-sm text-gray-500 mt-1">
                支持Markdown语法，用于在前端展示详细的套餐信息
              </p>
            </div>
          </div>

          {/* 价格和库存 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">价格和库存</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">价格 (¥) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="stock">库存数量 *</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  placeholder="0"
                  min="0"
                  required
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* 图片 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">套餐图片</h3>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="images">图片链接</Label>
                <Input
                  name="images"
                  type="url"
                  placeholder="https://example.com/image1.jpg"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Input
                  name="images"
                  type="url"
                  placeholder="https://example.com/image2.jpg"
                />
              </div>
              
              <div>
                <Input
                  name="images"
                  type="url"
                  placeholder="https://example.com/image3.jpg"
                />
              </div>
              
              <div>
                <Input
                  name="images"
                  type="url"
                  placeholder="https://example.com/image4.jpg"
                />
              </div>
            </div>
            
            <p className="text-sm text-gray-500">
              请输入图片的完整URL地址。第一张图片将作为封面图片。
            </p>
          </div>

          {/* 设置 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">套餐设置</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isFeatured">推荐套餐</Label>
                <p className="text-sm text-gray-500">
                  推荐套餐将显示在首页的精选推荐区域
                </p>
              </div>
              <Input
                id="isFeatured"
                name="isFeatured"
                type="checkbox"
                className="w-4 h-4"
              />
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="flex items-center gap-4 pt-6 border-t">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              创建套餐
            </Button>
            
            <Link href="/admin/packages">
              <Button variant="outline" type="button">
                取消
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}