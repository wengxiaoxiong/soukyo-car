import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function InactivePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            账户已被禁用
          </CardTitle>
          <CardDescription className="text-gray-600">
            您的账户已被管理员禁用，无法访问系统功能
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-gray-500">
            如果您认为这是一个错误，请联系管理员以重新激活您的账户。
          </p>
          <div className="space-x-4">
            <Button asChild variant="outline">
              <Link href="/">返回首页</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signin">重新登录</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 