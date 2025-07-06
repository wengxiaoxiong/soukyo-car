'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PackageCardData, getPackageList, deletePackage } from '@/lib/actions/packages'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Loader2, Plus, Search, Edit, Trash2, Eye, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'

export default function AdminPackagesPage() {
  const router = useRouter()
  const [packages, setPackages] = useState<PackageCardData[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const pageSize = 20

  // 获取套餐列表
  const fetchPackages = async () => {
    setLoading(true)
    try {
      const result = await getPackageList(currentPage, pageSize, {
        search: searchQuery || undefined,
        // 管理员可以看到所有套餐，包括未发布的
      })
      setPackages(result.packages)
      setTotalPages(result.totalPages)
      setTotal(result.total)
    } catch (error) {
      console.error('获取套餐列表失败:', error)
      toast.error('获取套餐列表失败')
    }
    setLoading(false)
  }

  // 初始加载和条件变化时获取数据
  useEffect(() => {
    fetchPackages()
  }, [currentPage, searchQuery])

  // 处理搜索
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  // 处理删除确认
  const handleDeleteConfirm = (packageId: string) => {
    setSelectedPackageId(packageId)
    setDeleteDialogOpen(true)
  }

  // 执行删除
  const handleDelete = async () => {
    if (!selectedPackageId) return

    setDeleting(true)
    try {
      const result = await deletePackage(selectedPackageId)
      if (result.success) {
        toast.success('套餐删除成功')
        setDeleteDialogOpen(false)
        fetchPackages()
      } else {
        toast.error(result.error || '删除失败')
      }
    } catch (error) {
      toast.error('删除失败')
    }
    setDeleting(false)
  }

  // 处理分页
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // 获取状态颜色
  const getStatusColor = (isActive: boolean, isPublished: boolean) => {
    if (!isActive) return 'bg-red-100 text-red-800'
    if (!isPublished) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }

  // 获取状态文本
  const getStatusText = (isActive: boolean, isPublished: boolean) => {
    if (!isActive) return '已停用'
    if (!isPublished) return '未发布'
    return '已发布'
  }

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">套餐管理</h1>
          <p className="text-gray-600 mt-2">管理所有套餐，共 {total} 个</p>
        </div>
        <Button onClick={() => router.push('/admin/packages/new')}>
          <Plus className="w-4 h-4 mr-2" />
          新建套餐
        </Button>
      </div>

      {/* 搜索和筛选 */}
      <Card>
        <CardHeader>
          <CardTitle>搜索和筛选</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="搜索套餐名称、描述..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 套餐列表 */}
      <Card>
        <CardHeader>
          <CardTitle>套餐列表</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">正在加载套餐...</span>
            </div>
          ) : packages.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>套餐信息</TableHead>
                      <TableHead>价格</TableHead>
                      <TableHead>库存</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>创建时间</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {packages.map((package_) => (
                      <TableRow key={package_.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={package_.thumbnail || package_.images[0] || '/placeholder-package.jpg'}
                              alt={package_.name}
                              className="w-12 h-12 rounded object-cover"
                            />
                            <div>
                              <div className="font-medium">{package_.title || package_.name}</div>
                              {package_.title && (
                                <div className="text-sm text-gray-500">{package_.name}</div>
                              )}
                              {package_.category && (
                                <Badge variant="outline" className="text-xs mt-1">
                                  {package_.category}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">¥{package_.price.toLocaleString()}</div>
                          {package_.originalPrice && package_.originalPrice > package_.price && (
                            <div className="text-sm text-gray-500 line-through">
                              ¥{package_.originalPrice.toLocaleString()}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className={`font-medium ${package_.stock <= 0 ? 'text-red-600' : package_.stock <= 10 ? 'text-yellow-600' : 'text-green-600'}`}>
                            {package_.stock}
                          </div>
                          {package_.stock <= 0 && (
                            <div className="text-xs text-red-500">缺货</div>
                          )}
                          {package_.stock > 0 && package_.stock <= 10 && (
                            <div className="text-xs text-yellow-500">库存不足</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={getStatusColor(package_.isActive, package_.isPublished)}
                          >
                            {getStatusText(package_.isActive, package_.isPublished)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(package_.createdAt), 'yyyy-MM-dd HH:mm')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/packages/${package_.id}`)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/admin/packages/${package_.id}/edit`)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteConfirm(package_.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* 分页 */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                    >
                      上一页
                    </Button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => handlePageChange(page)}
                        className="w-10"
                      >
                        {page}
                      </Button>
                    ))}
                    
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                    >
                      下一页
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                暂无套餐
              </h3>
              <p className="text-gray-500 mb-4">
                点击上方按钮创建第一个套餐
              </p>
              <Button onClick={() => router.push('/admin/packages/new')}>
                <Plus className="w-4 h-4 mr-2" />
                新建套餐
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 删除确认对话框 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              确认删除
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>确定要删除这个套餐吗？此操作无法撤销。</p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={deleting}
              >
                取消
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    删除中...
                  </>
                ) : (
                  '确认删除'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}