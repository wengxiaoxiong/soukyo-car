import { Suspense } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { UserPlus } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import { UserActions } from '@/components/admin/UserActions'
import { AddUserDialog } from '@/components/admin/AddUserDialog'
import { UserSearchAndFilter } from '@/components/admin/UserSearchAndFilter'
import { UserListWithPagination } from '@/components/admin/UserListWithPagination'


async function getUsers(page: number = 1, pageSize: number = 10) {
  try {
    const skip = (page - 1) * pageSize

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          image: true,
          phone: true,
          _count: {
            select: {
              orders: true
            }
          }
        }
      }),
      prisma.user.count()
    ])

    return {
      users,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    return {
      users: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: 1
    }
  }
}

function getRoleBadgeColor(role: UserRole) {
  switch (role) {
    case UserRole.ADMIN:
      return 'bg-red-100 text-red-800'
    case UserRole.MANAGER:
      return 'bg-blue-100 text-blue-800'
    case UserRole.USER:
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function getRoleText(role: UserRole) {
  switch (role) {
    case UserRole.ADMIN:
      return '管理员'
    case UserRole.MANAGER:
      return '经理'
    case UserRole.USER:
      return '用户'
    default:
      return '用户'
  }
}

async function UserList({ page }: { page: number }) {
  const { users, totalCount, totalPages, currentPage } = await getUsers(page)

  if (users.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">暂无用户数据</p>
      </div>
    )
  }

  return (
    <>
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          共 {totalCount} 条记录，第 {currentPage} 页 / 共 {totalPages} 页
        </p>
      </div>
      
      {/* 桌面端表格视图 */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>用户</TableHead>
              <TableHead>邮箱</TableHead>
              <TableHead>电话</TableHead>
              <TableHead>角色</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>订单数</TableHead>
              <TableHead>注册时间</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name || '用户头像'}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          {user.name?.[0] || user.email[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{user.name || '未设置姓名'}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone || '-'}</TableCell>
                <TableCell>
                  <Badge className={getRoleBadgeColor(user.role)}>
                    {getRoleText(user.role)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? 'default' : 'secondary'}>
                    {user.isActive ? '激活' : '停用'}
                  </Badge>
                </TableCell>
                <TableCell>{user._count.orders}</TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                </TableCell>
                <TableCell>
                  <UserActions user={user} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 移动端卡片视图 */}
      <div className="md:hidden space-y-4">
        {users.map((user) => (
          <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || '用户头像'}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {user.name?.[0] || user.email[0].toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <div className="font-medium text-gray-900">{user.name || '未设置姓名'}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getRoleBadgeColor(user.role)}>
                  {getRoleText(user.role)}
                </Badge>
                <Badge variant={user.isActive ? 'default' : 'secondary'}>
                  {user.isActive ? '激活' : '停用'}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">电话:</span>
                <span className="ml-1 text-gray-900">{user.phone || '-'}</span>
              </div>
              <div>
                <span className="text-gray-500">订单数:</span>
                <span className="ml-1 text-gray-900">{user._count.orders}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500">注册时间:</span>
                <span className="ml-1 text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                </span>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-100">
              <UserActions user={user} />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

async function UserListWithPaginationWrapper({ page }: { page: number }) {
  const { totalPages, currentPage } = await getUsers(page)
  
  return (
    <UserListWithPagination
      currentPage={currentPage}
      totalPages={totalPages}
    >
      <UserList page={page} />
    </UserListWithPagination>
  )
}

interface UsersPageProps {
  searchParams: Promise<{
    page?: string
  }>
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const resolvedSearchParams = await searchParams
  const currentPage = Number(resolvedSearchParams.page) || 1
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">用户管理</h1>
          <p className="text-gray-600 mt-2">管理系统用户和权限</p>
        </div>
        <AddUserDialog>
          <Button className="w-full sm:w-auto">
            <UserPlus className="w-4 h-4 mr-2" />
            添加用户
          </Button>
        </AddUserDialog>
      </div>

      <Card>
        <div className="p-6">
          <UserSearchAndFilter />
          
          <div className="mt-6">
            <Suspense fallback={<div className="text-center py-8">加载中...</div>}>
              <UserListWithPaginationWrapper page={currentPage} />
            </Suspense>
          </div>
        </div>
      </Card>
    </div>
  )
} 