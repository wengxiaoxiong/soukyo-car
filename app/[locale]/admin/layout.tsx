import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { UserRole } from '@prisma/client'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  
  // 如果没有登录，重定向到登录页面
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }
  
  // 检查用户是否处于活跃状态
  if (session.user.isActive === false) {
    redirect('/auth/inactive')
  }
  
  // 只允许ADMIN和MANAGER用户访问管理后台
  const allowedRoles: UserRole[] = [UserRole.ADMIN, UserRole.MANAGER]
  if (!session.user.role || !allowedRoles.includes(session.user.role)) {
    redirect('/')
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
} 