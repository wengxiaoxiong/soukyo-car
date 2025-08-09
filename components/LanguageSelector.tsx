'use client'

import { useState, useEffect, useRef } from 'react'
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
  const hasInitialized = useRef(false)

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

  // 初始化语言同步逻辑（只在组件首次加载时执行一次）
  useEffect(() => {
    if (status === 'loading' || hasInitialized.current) return

    if (session?.user) {
      const storedLanguage = getLanguageFromStorage()
      const userPreferredLanguage = session.user.preferredLanguage

      // 只在首次加载时进行语言同步，避免后续强制切换
      if (userPreferredLanguage && !storedLanguage) {
        // 如果数据库中有语言偏好但本地存储没有，保存到本地存储
        saveLanguageToStorage(userPreferredLanguage)
        // 如果数据库语言与当前页面语言不同，跳转到数据库语言
        if (userPreferredLanguage !== locale) {
          const newPath = pathname.replace(`/${locale}`, `/${userPreferredLanguage}`)
          router.push(newPath)
        }
      } else if (!userPreferredLanguage && storedLanguage) {
        // 如果数据库中没有语言偏好，但本地存储有语言，同步到数据库
        syncLanguageToDatabase(storedLanguage)
      } else if (!userPreferredLanguage && !storedLanguage) {
        // 如果都没有，保存当前语言到本地存储和数据库
        saveLanguageToStorage(locale)
        syncLanguageToDatabase(locale)
      }

      hasInitialized.current = true
    }
  }, [session, status])

  const handleLanguageChange = async (newLanguage: string) => {
    // 1. 保存到localStorage（无论是否登录都保存）
    saveLanguageToStorage(newLanguage)

    // 2. 如果用户已登录，立即更新数据库中的语言偏好
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

        if (!response.ok) {
          console.error('更新语言偏好失败')
        }
      } catch (error) {
        console.error('更新语言偏好失败:', error)
      } finally {
        setIsUpdating(false)
      }
    }

    // 3. 最后切换前端页面语言
    const newPath = pathname.replace(`/${locale}`, `/${newLanguage}`)
    router.push(newPath)
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