'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' },
  { code: 'zh', name: '中文' }
]

const LANGUAGE_STORAGE_KEY = 'preferred-language'

export default function LanguageSelector() {
  const { data: session, status } = useSession()
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isUpdating, setIsUpdating] = useState(false)
  const [hasSynced, setHasSynced] = useState(false)

  // 保存语言到localStorage
  const saveLanguageToStorage = (language: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
    }
  }

  // 从localStorage获取语言
  const getLanguageFromStorage = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(LANGUAGE_STORAGE_KEY)
    }
    return null
  }

  // 同步localStorage的语言到数据库
  const syncLanguageToDatabase = async (language: string) => {
    if (!session?.user) return

    setIsUpdating(true)
    try {
      const response = await fetch('/api/user/language', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ language })
      })

      if (!response.ok) {
        console.error('同步语言偏好到数据库失败')
      }
    } catch (error) {
      console.error('同步语言偏好失败:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  // 当用户登录后，处理语言同步逻辑
  useEffect(() => {
    if (status === 'loading') return // 等待session加载完成

    if (session?.user && !hasSynced) {
      const storedLanguage = getLanguageFromStorage()
      const userPreferredLanguage = session.user.preferredLanguage

      // 优先级：本地存储 > 数据库偏好 > 当前页面语言
      // 如果本地存储有语言
      if (storedLanguage) {
        // 如果本地语言与数据库不同，同步到数据库
        if (storedLanguage !== userPreferredLanguage) {
          syncLanguageToDatabase(storedLanguage)
        }
        // 如果本地语言与当前页面语言不同，跳转到本地语言
        if (storedLanguage !== locale) {
          const newPath = pathname.replace(`/${locale}`, `/${storedLanguage}`)
          router.push(newPath)
        }
      }
      // 如果没有本地存储但用户数据库中有语言偏好
      else if (userPreferredLanguage && userPreferredLanguage !== locale) {
        // 保存用户偏好到本地存储
        saveLanguageToStorage(userPreferredLanguage)
        // 跳转到用户偏好语言
        const newPath = pathname.replace(`/${locale}`, `/${userPreferredLanguage}`)
        router.push(newPath)
      }
      // 如果都没有，保存当前语言到本地存储
      else if (!storedLanguage) {
        saveLanguageToStorage(locale)
      }

      setHasSynced(true)
    }
  }, [session, status, locale, pathname, router, hasSynced])

  const handleLanguageChange = async (newLanguage: string) => {
    // 1. 保存到localStorage（无论是否登录都保存）
    saveLanguageToStorage(newLanguage)

    // 2. 切换前端页面语言
    const newPath = pathname.replace(`/${locale}`, `/${newLanguage}`)
    router.push(newPath)

    // 3. 如果用户已登录，同时更新用户的语言偏好
    if (session?.user) {
      await syncLanguageToDatabase(newLanguage)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Language:</span>
      <Select value={locale} onValueChange={handleLanguageChange} disabled={isUpdating}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {LANGUAGES.map(lang => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
} 