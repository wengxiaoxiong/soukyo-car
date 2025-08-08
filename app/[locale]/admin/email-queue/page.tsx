'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, RefreshCw, Mail, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface QueueJob {
  id: string
  priority: number
  createdAt: string
  retryCount: number
}

interface QueueStatus {
  queue: QueueJob[]
  processing: QueueJob[]
  stats: {
    totalJobs: number
    pendingJobs: number
    completedJobs: number
    failedJobs: number
    processingJobs: number
  }
}

export default function EmailQueuePage() {
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    loadQueueStatus()
    
    if (autoRefresh) {
      const interval = setInterval(loadQueueStatus, 3000)
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const loadQueueStatus = async () => {
    try {
      const response = await fetch('/api/email-queue?detailed=true')
      const result = await response.json()
      
      if (result.success) {
        setQueueStatus(result.data)
      }
    } catch (error) {
      console.error('加载队列状态失败:', error)
    }
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    await loadQueueStatus()
    setIsLoading(false)
    toast.success('队列状态已更新')
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN')
  }

  const getPriorityColor = (priority: number) => {
    if (priority >= 5) return 'bg-red-100 text-red-800'
    if (priority >= 3) return 'bg-yellow-100 text-yellow-800'
    return 'bg-blue-100 text-blue-800'
  }

  const getPriorityText = (priority: number) => {
    if (priority >= 5) return '高'
    if (priority >= 3) return '中'
    return '低'
  }

  if (!queueStatus) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">加载队列状态中...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">邮件队列管理</h1>
          <p className="text-gray-600 mt-2">监控邮件发送队列状态</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'bg-green-50 border-green-200' : ''}
          >
            {autoRefresh ? '自动刷新开启' : '自动刷新关闭'}
          </Button>
          <Button onClick={handleRefresh} disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            刷新
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">总任务数</p>
              <p className="text-2xl font-bold text-gray-900">{queueStatus.stats.totalJobs}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">等待中</p>
              <p className="text-2xl font-bold text-blue-600">{queueStatus.stats.pendingJobs}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">处理中</p>
              <p className="text-2xl font-bold text-yellow-600">{queueStatus.stats.processingJobs}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">已完成</p>
              <p className="text-2xl font-bold text-green-600">{queueStatus.stats.completedJobs}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">失败</p>
              <p className="text-2xl font-bold text-red-600">{queueStatus.stats.failedJobs}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 等待队列 */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">等待队列</h3>
            <Badge variant="secondary">{queueStatus.queue.length} 个任务</Badge>
          </div>
          
          {queueStatus.queue.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              暂无等待中的任务
            </div>
          ) : (
            <div className="space-y-2">
              {queueStatus.queue.slice(0, 10).map((job) => (
                <div key={job.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{job.id}</div>
                      <div className="text-xs text-gray-500">
                        创建时间: {formatTime(job.createdAt)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(job.priority)}>
                        {getPriorityText(job.priority)}优先级
                      </Badge>
                      {job.retryCount > 0 && (
                        <Badge variant="outline" className="text-orange-600">
                          重试 {job.retryCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {queueStatus.queue.length > 10 && (
                <div className="text-center text-gray-500 py-2">
                  还有 {queueStatus.queue.length - 10} 个任务...
                </div>
              )}
            </div>
          )}
        </Card>

        {/* 处理中队列 */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">处理中队列</h3>
            <Badge variant="secondary">{queueStatus.processing.length} 个任务</Badge>
          </div>
          
          {queueStatus.processing.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              暂无处理中的任务
            </div>
          ) : (
            <div className="space-y-2">
              {queueStatus.processing.map((job) => (
                <div key={job.id} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{job.id}</div>
                      <div className="text-xs text-gray-500">
                        开始时间: {formatTime(job.createdAt)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(job.priority)}>
                        {getPriorityText(job.priority)}优先级
                      </Badge>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* 队列说明 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">队列说明</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <strong>等待队列：</strong>邮件任务已添加到队列，等待处理。任务按优先级排序，高优先级任务优先处理。
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <strong>处理中队列：</strong>正在发送的邮件任务。系统最多同时处理3个邮件任务，避免并发过多导致API限制。
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <strong>已完成：</strong>成功发送的邮件任务数量。
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <strong>失败：</strong>发送失败且重试次数已用完的邮件任务数量。失败的任务会记录错误日志。
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <strong>重试机制：</strong>发送失败的邮件会自动重试，最多重试3次。每次重试会降低任务优先级。
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
