"use client"

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { MultiImageUpload } from '@/components/ui/multi-image-upload'
import { ArrowLeft, Edit, Save, X, Package as PackageIcon, Eye, EyeOff, Star } from 'lucide-react'
import Link from 'next/link'
import { createPackage, updatePackage, togglePackageStatus, type Package } from '@/lib/actions/packages'
import { toast } from 'sonner'

interface PackageFormProps {
  package?: Package
  mode: 'view' | 'edit' | 'create'
}

export function PackageForm({ package: packageData, mode }: PackageFormProps) {
  const [isEditing, setIsEditing] = useState(mode === 'edit' || mode === 'create')
  const [images, setImages] = useState<string[]>(packageData?.images || [])

  const handleImagesChange = (newImages: string[]) => {
    setImages(newImages)
  }

  const handleSubmit = async (formData: FormData) => {
    try {
      // 添加图片数据到 formData
      images.forEach(img => {
        if (img.trim()) {
          formData.append('images', img.trim())
        }
      })

      if (mode === 'create') {
        await createPackage(formData)
        toast.success('套餐创建成功！')
      } else if (packageData) {
        await updatePackage(packageData.id, formData)
        toast.success('套餐修改已保存！')
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Package form submission error:', error)
      toast.error('操作失败，请重试。')
    }
  }

  const handleToggleStatus = async () => {
    if (packageData) {
      await togglePackageStatus(packageData.id)
      window.location.reload()
    }
  }

  const backUrl = '/admin/packages'
  const isViewMode = mode === 'view' && !isEditing

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href={backUrl}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回套餐管理
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {mode === 'create' ? '添加新套餐' : 
               isEditing ? '编辑套餐' : '套餐详情'}
            </h1>
            <p className="text-gray-600 mt-2">
              {mode === 'create' ? '创建一个新的套餐产品' :
               isEditing ? '修改套餐信息' : '查看套餐详细信息'}
            </p>
          </div>
        </div>

        {mode === 'view' && packageData && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleToggleStatus}
              className={packageData.isActive ? 'text-orange-600 hover:text-orange-800' : 'text-green-600 hover:text-green-800'}
            >
              {packageData.isActive ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {packageData.isActive ? '停用' : '启用'}
            </Button>
            
            <Link href={`/admin/packages/${packageData.id}/edit`}>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Edit className="w-4 h-4 mr-2" />
                编辑套餐
              </Button>
            </Link>
          </div>
        )}

        {isEditing && mode !== 'create' && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              <X className="w-4 h-4 mr-2" />
              取消
            </Button>
          </div>
        )}
      </div>

      {/* 套餐状态信息 */}
      {packageData && mode === 'view' && (
        <Card className="mb-6 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-100">
                <PackageIcon className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{packageData.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={packageData.isActive ? 'default' : 'secondary'}>
                    {packageData.isActive ? '活跃' : '停用'}
                  </Badge>
                  {packageData.isFeatured && (
                    <Badge variant="outline" className="text-purple-600 border-purple-600">
                      <Star className="w-3 h-3 mr-1" />
                      推荐
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">¥{packageData.price.toLocaleString()}</div>
              <div className="text-sm text-gray-500">库存: {packageData.stock}</div>
            </div>
          </div>
        </Card>
      )}

      <Card className="max-w-4xl">
        <form action={handleSubmit} className="p-6 space-y-6">
          {/* 基本信息 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">基本信息</h3>
            
            <div>
              <Label htmlFor="name">套餐名称 *</Label>
              {isViewMode ? (
                <div className="mt-1 p-3 bg-gray-50 rounded-md">
                  {packageData?.name || '-'}
                </div>
              ) : (
                <Input
                  id="name"
                  name="name"
                  defaultValue={packageData?.name}
                  placeholder="请输入套餐名称"
                  required
                  className="mt-1"
                />
              )}
            </div>

            <div>
              <Label htmlFor="description">套餐描述</Label>
              {isViewMode ? (
                <div className="mt-1 p-3 bg-gray-50 rounded-md min-h-[80px]">
                  {packageData?.description || '-'}
                </div>
              ) : (
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={packageData?.description || ''}
                  placeholder="请输入套餐描述"
                  rows={3}
                  className="mt-1"
                />
              )}
            </div>

            <div>
              <Label htmlFor="content">详细内容 (Markdown)</Label>
              {isViewMode ? (
                <div className="mt-1 p-3 bg-gray-50 rounded-md min-h-[120px] font-mono text-sm">
                  {packageData?.content || '-'}
                </div>
              ) : (
                <Textarea
                  id="content"
                  name="content"
                  defaultValue={packageData?.content || ''}
                  placeholder="请输入套餐的详细内容，支持Markdown格式"
                  rows={6}
                  className="mt-1 font-mono"
                />
              )}
              {!isViewMode && (
                <p className="text-sm text-gray-500 mt-1">
                  支持Markdown语法，用于在前端展示详细的套餐信息
                </p>
              )}
            </div>
          </div>

          {/* 价格和库存 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">价格和库存</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">价格 (¥) *</Label>
                {isViewMode ? (
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    ¥{packageData?.price.toLocaleString() || '-'}
                  </div>
                ) : (
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    defaultValue={packageData?.price}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                    className="mt-1"
                  />
                )}
              </div>

              <div>
                <Label htmlFor="stock">库存数量 *</Label>
                {isViewMode ? (
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    {packageData?.stock || '-'}
                  </div>
                ) : (
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    defaultValue={packageData?.stock}
                    placeholder="0"
                    min="0"
                    required
                    className="mt-1"
                  />
                )}
              </div>
            </div>
          </div>

          {/* 图片 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">套餐图片</h3>
            
            {isViewMode ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {packageData?.images && packageData.images.length > 0 ? (
                  packageData.images.map((image: string, index: number) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={image}
                        alt={`套餐图片 ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    暂无图片
                  </div>
                )}
              </div>
            ) : (
              <div>
                <MultiImageUpload
                  value={images}
                  onChange={handleImagesChange}
                  disabled={false}
                  placeholder="点击上传套餐图片或拖拽图片到此处"
                  maxSize={5}
                  maxImages={8}
                />
                <p className="text-sm text-gray-500 mt-2">
                  第一张图片将作为封面图片。支持 JPEG, PNG, GIF, WEBP 格式。
                </p>
              </div>
            )}
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
              {isViewMode ? (
                <Badge variant={packageData?.isFeatured ? 'default' : 'secondary'}>
                  {packageData?.isFeatured ? '是' : '否'}
                </Badge>
              ) : (
                <Input
                  id="isFeatured"
                  name="isFeatured"
                  type="checkbox"
                  defaultChecked={packageData?.isFeatured}
                  className="w-4 h-4"
                />
              )}
            </div>
          </div>

          {/* 提交按钮 */}
          {!isViewMode && (
            <div className="flex items-center gap-4 pt-6 border-t">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {mode === 'create' ? '创建套餐' : '保存修改'}
              </Button>
              
              <Link href={backUrl}>
                <Button variant="outline" type="button">
                  取消
                </Button>
              </Link>
            </div>
          )}
        </form>
      </Card>

      {/* 时间信息 */}
      {packageData && mode === 'view' && (
        <Card className="mt-6 max-w-4xl">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">时间信息</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">创建时间：</span>
                <span className="text-gray-900">
                  {new Date(packageData.createdAt).toLocaleString('zh-CN')}
                </span>
              </div>
              <div>
                <span className="text-gray-600">更新时间：</span>
                <span className="text-gray-900">
                  {new Date(packageData.updatedAt).toLocaleString('zh-CN')}
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}