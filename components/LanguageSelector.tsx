'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: '中文', flag: '🇨🇳' }
]

export default function LanguageSelector() {
  const { data: session } = useSession()
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isUpdating, setIsUpdating] = useState(false)

  // 当用户登录后，获取用户的语言偏好
  useEffect(() => {
    if (session?.user) {
      // 从session中获取用户的语言偏好，但前端显示仍使用当前locale
      // 这样前端语言和用户偏好可以不同步
    }
  }, [session])

  const handleLanguageChange = async (newLanguage: string) => {
    // 1. 首先切换前端页面语言
    const newPath = pathname.replace(`/${locale}`, `/${newLanguage}`)
    router.push(newPath)

    // 2. 如果用户已登录，同时更新用户的语言偏好
    if (session?.user) {
      setIsUpdating(true)
      try {
        const response = await fetch('/api/user/language', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ language: newLanguage })
        })

        if (response.ok) {
          // 静默更新，不显示提示
        } else {
          console.error('更新语言偏好失败')
        }
      } catch (error) {
        console.error('更新语言偏好失败:', error)
      } finally {
        setIsUpdating(false)
      }
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">语言:</span>
      <Select value={locale} onValueChange={handleLanguageChange} disabled={isUpdating}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {LANGUAGES.map(lang => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
} 