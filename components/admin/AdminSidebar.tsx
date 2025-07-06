'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Store, 
  Car, 
  Users, 
  FileText, 
  BarChart3, 
  Settings
} from 'lucide-react'

const navigation = [
  { name: '仪表板', href: '/admin', icon: BarChart3 },
  { name: '店面管理', href: '/admin/stores', icon: Store },
  { name: '套餐管理', href: '/admin/packages', icon: Car },
  { name: '用户管理', href: '/admin/users', icon: Users },
  { name: '订单管理', href: '/admin/orders', icon: FileText },
  { name: '设置', href: '/admin/settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <Link href="/admin" className="flex items-center space-x-2">
          <Image src="/logo.png" alt="Soukyo租车" width={150} height={32} />
        </Link>
      </div>
      <nav className="mt-8">
        <div className="px-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
} 