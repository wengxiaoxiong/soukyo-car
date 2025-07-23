import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function InactivePage() {
  const t = useTranslations('auth')
  const commonT = useTranslations('common')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            {t('account_disabled_title')}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {t('account_disabled_description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-gray-500">
            {t('account_disabled_contact_admin')}
          </p>
          <div className="space-x-4">
            <Button asChild variant="outline">
              <Link href="/">{commonT('return_home')}</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signin">{commonT('relogin')}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 