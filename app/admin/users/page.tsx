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
  searchParams: {
    page?: string
  }
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const currentPage = Number(searchParams.page) || 1
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">用户管理</h1>
          <p className="text-gray-600 mt-2">管理系统用户和权限</p>
        </div>
        <AddUserDialog>
          <Button>
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