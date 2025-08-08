import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取所有邮件模板
export async function GET() {
  try {
    const templates = await prisma.emailTemplate.findMany({
      orderBy: { createdAt: 'asc' }
    })
    
    return NextResponse.json({ success: true, data: templates })
  } catch (error) {
    console.error('获取邮件模板失败:', error)
    return NextResponse.json(
      { success: false, error: '获取邮件模板失败' },
      { status: 500 }
    )
  }
}

// 创建或更新邮件模板
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { status, language = 'en', subject, content, emoji, isActive = true } = body

    if (!status || !subject || !content) {
      return NextResponse.json(
        { success: false, error: '缺少必要字段' },
        { status: 400 }
      )
    }

    const template = await prisma.emailTemplate.upsert({
      where: { 
        status_language: {
          status,
          language
        }
      },
      update: { subject, content, emoji, isActive },
      create: { status, language, subject, content, emoji, isActive }
    })

    return NextResponse.json({ success: true, data: template })
  } catch (error) {
    console.error('保存邮件模板失败:', error)
    return NextResponse.json(
      { success: false, error: '保存邮件模板失败' },
      { status: 500 }
    )
  }
}

// 删除邮件模板
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const language = searchParams.get('language') || 'en'

    if (!status) {
      return NextResponse.json(
        { success: false, error: '缺少模板状态参数' },
        { status: 400 }
      )
    }

    await prisma.emailTemplate.delete({
      where: { 
        status_language: {
          status,
          language
        }
      }
    })

    return NextResponse.json({ success: true, message: '模板删除成功' })
  } catch (error) {
    console.error('删除邮件模板失败:', error)
    return NextResponse.json(
      { success: false, error: '删除邮件模板失败' },
      { status: 500 }
    )
  }
}
