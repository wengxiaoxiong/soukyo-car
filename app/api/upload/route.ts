import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('filename')

    if (!filename) {
      return NextResponse.json(
        { error: '缺少文件名参数' },
        { status: 400 }
      )
    }

    // 检查文件类型
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    const contentType = request.headers.get('content-type')
    
    if (!contentType || !allowedTypes.includes(contentType)) {
      return NextResponse.json(
        { error: '不支持的文件类型。仅支持 JPEG, PNG, GIF, WEBP 格式' },
        { status: 400 }
      )
    }

    // 检查文件大小 (5MB限制)
    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: '文件大小不能超过5MB' },
        { status: 400 }
      )
    }

    if (!request.body) {
      return NextResponse.json(
        { error: '请求体为空' },
        { status: 400 }
      )
    }

    const blob = await put(filename, request.body, {
      access: 'public',
    })

    return NextResponse.json({
      url: blob.url,
      downloadUrl: blob.downloadUrl,
      pathname: blob.pathname,
    })
  } catch (error) {
    console.error('上传失败:', error)
    return NextResponse.json(
      { error: '上传失败，请重试' },
      { status: 500 }
    )
  }
} 