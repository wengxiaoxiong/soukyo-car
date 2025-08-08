import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      )
    }

    const { language } = await request.json()
    
    // 验证语言代码
    const validLanguages = ['en', 'ja', 'zh']
    if (!validLanguages.includes(language)) {
      return NextResponse.json(
        { success: false, error: '无效的语言代码' },
        { status: 400 }
      )
    }

    // 更新用户语言偏好
    await prisma.user.update({
      where: { id: session.user.id },
      data: { preferredLanguage: language }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('更新用户语言偏好失败:', error)
    return NextResponse.json(
      { success: false, error: '更新失败' },
      { status: 500 }
    )
  }
}

