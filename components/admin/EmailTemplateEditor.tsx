'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Mail, Eye, Edit, Send, Save, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface EmailTemplate {
  id?: string
  status: string
  language: string
  subject: string
  content: string
  emoji?: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

const ORDER_STATUSES = [
  { status: 'PENDING', label: '订单创建', color: 'bg-blue-100 text-blue-800' },
  { status: 'CONFIRMED', label: '商家确认', color: 'bg-green-100 text-green-800' },
  { status: 'CANCELLED', label: '订单取消', color: 'bg-red-100 text-red-800' },
  { status: 'CANCELLED_USER', label: '用户取消', color: 'bg-orange-100 text-orange-800' },
  { status: 'ONGOING', label: '订单进行中', color: 'bg-purple-100 text-purple-800' },
  { status: 'COMPLETED', label: '订单完成', color: 'bg-gray-100 text-gray-800' },
  { status: 'REFUNDED', label: '退款成功', color: 'bg-yellow-100 text-yellow-800' },
  { status: 'PAYMENT_REMINDER', label: '付款提醒', color: 'bg-pink-100 text-pink-800' }
]

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' },
  { code: 'zh', name: '中文' }
]

export default function EmailTemplateEditor() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [testEmail, setTestEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [queueStats, setQueueStats] = useState<any>(null) // eslint-disable-line @typescript-eslint/no-explicit-any

  // 加载邮件模板
  useEffect(() => {
    loadTemplates()
    loadQueueStats()
    
    // 每5秒更新一次队列状态
    const interval = setInterval(loadQueueStats, 5000)
    
    return () => clearInterval(interval)
  }, [])

  // 加载队列统计信息
  const loadQueueStats = async () => {
    try {
      const response = await fetch('/api/email-queue')
      const result = await response.json()
      
      if (result.success) {
        setQueueStats(result.data)
      }
    } catch (error) {
      console.error('加载队列统计失败:', error)
    }
  }

  const loadTemplates = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/email-templates')
      const result = await response.json()
      
      if (result.success) {
        setTemplates(result.data)
      } else {
        toast.error('加载邮件模板失败')
      }
    } catch (error) {
      console.error('加载邮件模板失败:', error)
      toast.error('加载邮件模板失败')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTemplateSelect = (template: EmailTemplate) => {
    setSelectedTemplate(template)
    setPreviewMode(false)
  }

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language)
    // 如果当前选中的模板不是该语言，清空选择
    if (selectedTemplate && selectedTemplate.language !== language) {
      setSelectedTemplate(null)
    }
  }

  const handleTemplateUpdate = (field: keyof EmailTemplate, value: string) => {
    if (!selectedTemplate) return

    const updatedTemplate = { ...selectedTemplate, [field]: value }
    setSelectedTemplate(updatedTemplate)
    
    setTemplates(prev => 
      prev.map(t => 
        t.status === selectedTemplate.status && t.language === selectedTemplate.language 
          ? updatedTemplate 
          : t
      )
    )
  }

  const handleSaveTemplate = async () => {
    if (!selectedTemplate) return

    setIsSaving(true)
    try {
      const response = await fetch('/api/email-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedTemplate)
      })

      const result = await response.json()
      
      if (result.success) {
        toast.success('模板保存成功')
        await loadTemplates() // 重新加载模板
      } else {
        toast.error(result.error || '保存失败')
      }
    } catch (error) {
      console.error('保存模板失败:', error)
      toast.error('保存模板失败')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePreview = () => {
    setPreviewMode(!previewMode)
  }

  const handleTestEmail = async () => {
    if (!testEmail || !selectedTemplate) return

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: testEmail,
          template: selectedTemplate
        })
      })

      if (response.ok) {
        const langInfo = getLanguageInfo(selectedTemplate.language)
        toast.success(`${langInfo.name} 测试邮件已添加到队列！`)
        // 重新加载队列统计
        await loadQueueStats()
      } else {
        toast.error('测试邮件发送失败，请检查配置。')
      }
    } catch (error) {
      console.error('发送测试邮件失败:', error)
      toast.error('发送测试邮件失败')
    }
  }

  const getStatusLabel = (status: string) => {
    const statusInfo = ORDER_STATUSES.find(s => s.status === status)
    return statusInfo?.label || status
  }

  const getStatusColor = (status: string) => {
    const statusInfo = ORDER_STATUSES.find(s => s.status === status)
    return statusInfo?.color || 'bg-gray-100 text-gray-800'
  }

  const getLanguageInfo = (languageCode: string) => {
    return LANGUAGES.find(l => l.code === languageCode) || LANGUAGES[0]
  }

  // 获取当前语言的模板
  const currentLanguageTemplates = templates.filter(template => template.language === selectedLanguage)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">加载邮件模板中...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">邮件模板管理</h1>
          <p className="text-gray-600 mt-2">管理订单状态变更时的邮件模板</p>
          <div className="mt-2 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>邮件语言选择逻辑：</strong>
            </p>
            <ul className="text-xs text-blue-700 mt-1 space-y-1">
              <li>• 优先使用用户的语言偏好设置（preferredLanguage）</li>
              <li>• 如果用户偏好语言模板不存在，回退到英语模板</li>
              <li>• 如果英语模板也不存在，最后使用中文模板</li>
              <li>• 如果所有语言模板都不存在，使用系统默认模板</li>
            </ul>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {queueStats && (
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>队列: {queueStats.pendingJobs}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>处理中: {queueStats.processingJobs}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>已完成: {queueStats.completedJobs}</span>
              </div>
              {queueStats.failedJobs > 0 && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>失败: {queueStats.failedJobs}</span>
                </div>
              )}
            </div>
          )}
          <div className="flex items-center gap-2">
            <Mail className="w-6 h-6 text-blue-600" />
            <span className="text-sm text-gray-600">邮件模板</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 模板列表 */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">邮件模板列表</h3>
            <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
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
          <div className="space-y-2">
            {currentLanguageTemplates.map((template) => (
              <div
                key={`${template.status}-${template.language}`}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedTemplate?.status === template.status && selectedTemplate?.language === template.language
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleTemplateSelect(template)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-lg flex-shrink-0">{template.emoji || '📧'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {getStatusLabel(template.status)}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {template.subject}
                      </div>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(template.status)} flex-shrink-0 ml-2`}>
                    {template.status}
                  </Badge>
                </div>
              </div>
            ))}
            {currentLanguageTemplates.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                当前语言暂无模板
              </div>
            )}
          </div>
        </Card>

        {/* 模板编辑 */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {selectedTemplate ? '编辑模板' : '选择模板'}
            </h3>
            {selectedTemplate && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreview}
                >
                  {previewMode ? <Edit className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {previewMode ? '编辑' : '预览'}
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveTemplate}
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  保存
                </Button>
              </div>
            )}
          </div>

          {selectedTemplate ? (
            previewMode ? (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-2">邮件标题</div>
                  <div className="font-medium break-words">{selectedTemplate.subject}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-2">邮件内容</div>
                  <div className="text-sm whitespace-pre-wrap break-words">{selectedTemplate.content}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-2">表情符号</div>
                  <div className="text-2xl">{selectedTemplate.emoji || '📧'}</div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="language">语言</Label>
                  <Select
                    value={selectedTemplate.language}
                    onValueChange={(value) => handleTemplateUpdate('language', value)}
                  >
                    <SelectTrigger>
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
                <div>
                  <Label htmlFor="emoji">表情符号</Label>
                  <Input
                    id="emoji"
                    value={selectedTemplate.emoji || ''}
                    onChange={(e) => handleTemplateUpdate('emoji', e.target.value)}
                    placeholder="输入表情符号"
                  />
                </div>
                <div>
                  <Label htmlFor="subject">邮件标题</Label>
                  <Input
                    id="subject"
                    value={selectedTemplate.subject}
                    onChange={(e) => handleTemplateUpdate('subject', e.target.value)}
                    placeholder="输入邮件标题"
                  />
                </div>
                <div>
                  <Label htmlFor="content">邮件内容</Label>
                  <Textarea
                    id="content"
                    value={selectedTemplate.content}
                    onChange={(e) => handleTemplateUpdate('content', e.target.value)}
                    placeholder="输入邮件内容"
                    rows={8}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    支持变量：[用户姓名], [订单编号], [车型名称], [取车时间], [还车时间], [门店名称], [订单详情链接]
                  </p>
                </div>
              </div>
            )
          ) : (
            <div className="text-center text-gray-500 py-8">
              请选择一个模板进行编辑
            </div>
          )}
        </Card>

        {/* 测试发送 */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">测试发送</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="test-email">测试邮箱</Label>
              <Input
                id="test-email"
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="输入测试邮箱地址"
              />
            </div>
            <div>
              <Label>选择模板</Label>
              <Select
                value={selectedTemplate ? `${selectedTemplate.status}-${selectedTemplate.language}` : ''}
                onValueChange={(value) => {
                  const [status, language] = value.split('-')
                  const template = templates.find(t => t.status === status && t.language === language)
                  if (template) {
                    setSelectedTemplate(template)
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择要测试的模板" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => {
                    const langInfo = getLanguageInfo(template.language)
                    return (
                      <SelectItem 
                        key={`${template.status}-${template.language}`} 
                        value={`${template.status}-${template.language}`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{template.emoji || '📧'}</span>
                          <span className="truncate">{getStatusLabel(template.status)}</span>
                          <span className="text-xs text-gray-500 flex-shrink-0">({langInfo.name})</span>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
            {selectedTemplate && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-800">
                  <strong>当前选择：</strong>
                  {getLanguageInfo(selectedTemplate.language).name} - {getStatusLabel(selectedTemplate.status)}
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  将发送 {getLanguageInfo(selectedTemplate.language).name} 版本的邮件
                </div>
              </div>
            )}
            <Button
              onClick={handleTestEmail}
              disabled={!testEmail || !selectedTemplate}
              className="w-full"
            >
              <Send className="w-4 h-4 mr-2" />
              发送测试邮件
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
