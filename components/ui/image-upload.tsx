'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onRemove?: () => void
  disabled?: boolean
  className?: string
  placeholder?: string
  maxSize?: number // MB
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled = false,
  className,
  placeholder = '点击上传图片或拖拽图片到此处',
  maxSize = 5,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    // 检查文件类型
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return '不支持的文件类型。仅支持 JPEG, PNG, GIF, WEBP 格式'
    }

    // 检查文件大小
    if (file.size > maxSize * 1024 * 1024) {
      return `文件大小不能超过${maxSize}MB`
    }

    return null
  }

  const uploadFile = async (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setError('')
    setIsUploading(true)

    try {
      // 生成唯一文件名
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const extension = file.name.split('.').pop()
      const filename = `${timestamp}-${randomString}.${extension}`

      const response = await fetch(`/api/upload?filename=${filename}`, {
        method: 'POST',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '上传失败')
      }

      onChange(data.url)
    } catch (err) {
      const message = err instanceof Error ? err.message : '上传失败，请重试'
      setError(message)
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadFile(file)
    }
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled && !isUploading) {
      setIsDragging(true)
    }
  }, [disabled, isUploading])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (disabled || isUploading) return

    const file = e.dataTransfer.files[0]
    if (file) {
      uploadFile(file)
    }
  }, [disabled, isUploading])

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click()
    }
  }

  const handleRemove = () => {
    if (onRemove) {
      onRemove()
    } else {
      onChange('')
    }
    setError('')
  }

  return (
    <div className={cn('space-y-2', className)}>
      {value ? (
        // 图片预览模式
        <div className="relative group">
          <img
            src={value}
            alt="预览图片"
            className="w-full h-64 object-cover rounded-lg border border-gray-200"
            onError={() => setError('图片加载失败')}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleClick}
                disabled={disabled || isUploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                更换图片
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemove}
                disabled={disabled || isUploading}
              >
                <X className="w-4 h-4 mr-2" />
                删除
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // 上传区域
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400',
            disabled && 'cursor-not-allowed opacity-50',
            isUploading && 'cursor-not-allowed'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <div className="flex flex-col items-center space-y-4">
            {isUploading ? (
              <>
                <Loader2 className="w-12 h-12 text-gray-400 animate-spin" />
                <p className="text-gray-600">上传中...</p>
              </>
            ) : (
              <>
                <ImageIcon className="w-12 h-12 text-gray-400" />
                <div className="space-y-2">
                  <p className="text-gray-600">{placeholder}</p>
                  <p className="text-sm text-gray-500">
                    支持 JPEG, PNG, GIF, WEBP 格式，最大 {maxSize}MB
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* 错误提示 */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
} 