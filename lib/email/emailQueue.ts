import type { EmailParams } from '@/types/email'

interface EmailJob {
  id: string
  params: EmailParams & { isUserCancelled?: boolean; userLanguage?: string }
  priority: number
  createdAt: Date
  retryCount: number
  maxRetries: number
}

interface QueueStats {
  totalJobs: number
  pendingJobs: number
  completedJobs: number
  failedJobs: number
  processingJobs: number
}

class EmailQueue {
  private queue: EmailJob[] = []
  private processing: EmailJob[] = []
  private completed: EmailJob[] = []
  private failed: EmailJob[] = []
  private isProcessing = false
  private emailService: any = null // eslint-disable-line @typescript-eslint/no-explicit-any
  private maxConcurrent = 3 // 最大并发数
  private processingInterval: NodeJS.Timeout | null = null

  constructor() {
    this.startProcessing()
  }

  // 延迟初始化 EmailService
  private async getEmailService() {
    if (!this.emailService) {
      const { EmailService } = await import('./emailService')
      this.emailService = new EmailService()
    }
    return this.emailService
  }

  // 添加邮件任务到队列
  async addToQueue(params: EmailParams & { isUserCancelled?: boolean; userLanguage?: string }, priority: number = 1): Promise<string> {
    const job: EmailJob = {
      id: this.generateJobId(),
      params,
      priority,
      createdAt: new Date(),
      retryCount: 0,
      maxRetries: 3
    }

    // 按优先级插入队列（优先级高的在前面）
    const insertIndex = this.queue.findIndex(qJob => qJob.priority < priority)
    if (insertIndex === -1) {
      this.queue.push(job)
    } else {
      this.queue.splice(insertIndex, 0, job)
    }

    console.log(`邮件任务已添加到队列: ${job.id}, 优先级: ${priority}, 队列长度: ${this.queue.length}`)
    return job.id
  }

  // 开始处理队列
  private startProcessing() {
    if (this.processingInterval) {
      clearInterval(this.processingInterval)
    }

    this.processingInterval = setInterval(() => {
      this.processQueue()
    }, 1000) // 每秒检查一次队列
  }

  // 处理队列中的任务
  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) {
      return
    }

    // 检查是否达到最大并发数
    if (this.processing.length >= this.maxConcurrent) {
      return
    }

    this.isProcessing = true

    try {
      // 取出队列中的第一个任务
      const job = this.queue.shift()
      if (!job) {
        return
      }

      // 将任务标记为处理中
      this.processing.push(job)
      console.log(`开始处理邮件任务: ${job.id}`)

      // 发送邮件
      const emailService = await this.getEmailService()
      
      // 根据状态选择不同的发送方法
      let result
      if (job.params.status === 'PAYMENT_REMINDER') {
        result = await emailService.sendPaymentReminderEmailDirectly(job.params)
      } else {
        result = await emailService.sendEmailDirectly(job.params)
      }

      if (result.success) {
        // 发送成功，移动到已完成列表
        this.processing = this.processing.filter(j => j.id !== job.id)
        this.completed.push(job)
        console.log(`邮件任务完成: ${job.id}`)
      } else {
        // 发送失败，尝试重试
        await this.handleFailedJob(job, result.error)
      }
    } catch (error) {
      console.error('处理邮件队列时发生错误:', error)
    } finally {
      this.isProcessing = false
    }
  }

  // 处理失败的任务
  private async handleFailedJob(job: EmailJob, error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    job.retryCount++

    if (job.retryCount <= job.maxRetries) {
      // 还有重试次数，重新加入队列（降低优先级）
      job.priority = Math.max(1, job.priority - 1)
      this.queue.push(job)
      console.log(`邮件任务重试 ${job.retryCount}/${job.maxRetries}: ${job.id}`)
    } else {
      // 重试次数用完，标记为失败
      this.processing = this.processing.filter(j => j.id !== job.id)
      this.failed.push(job)
      console.error(`邮件任务最终失败: ${job.id}, 错误:`, error)
    }
  }

  // 生成任务ID
  private generateJobId(): string {
    return `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // 获取队列统计信息
  getStats(): QueueStats {
    return {
      totalJobs: this.queue.length + this.processing.length + this.completed.length + this.failed.length,
      pendingJobs: this.queue.length,
      processingJobs: this.processing.length,
      completedJobs: this.completed.length,
      failedJobs: this.failed.length
    }
  }

  // 获取队列状态
  getQueueStatus() {
    return {
      queue: this.queue.map(job => ({
        id: job.id,
        priority: job.priority,
        createdAt: job.createdAt,
        retryCount: job.retryCount
      })),
      processing: this.processing.map(job => ({
        id: job.id,
        priority: job.priority,
        createdAt: job.createdAt,
        retryCount: job.retryCount
      })),
      stats: this.getStats()
    }
  }

  // 清空队列（仅用于测试）
  clearQueue() {
    this.queue = []
    this.processing = []
    this.completed = []
    this.failed = []
  }

  // 停止队列处理
  stop() {
    if (this.processingInterval) {
      clearInterval(this.processingInterval)
      this.processingInterval = null
    }
  }
}

// 创建单例实例
export const emailQueue = new EmailQueue()

// 导出便捷函数
export const addEmailToQueue = (params: EmailParams & { isUserCancelled?: boolean; userLanguage?: string }, priority?: number) => {
  return emailQueue.addToQueue(params, priority)
}

export const getQueueStats = () => {
  return emailQueue.getStats()
}

export const getQueueStatus = () => {
  return emailQueue.getQueueStatus()
}
