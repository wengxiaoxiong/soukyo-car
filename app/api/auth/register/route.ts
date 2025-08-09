import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, preferredLanguage } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "邮箱和密码是必填项" },
        { status: 400 }
      )
    }

    // 检查用户是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "该邮箱已被注册" },
        { status: 400 }
      )
    }

    // 验证语言代码（如果提供）
    const validLanguages = ['en', 'ja', 'zh']
    const languageToSave = preferredLanguage && validLanguages.includes(preferredLanguage) 
      ? preferredLanguage 
      : 'ja' // 默认语言

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10)

    // 创建用户
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        role: UserRole.USER,
        preferredLanguage: languageToSave,
      }
    })

    // 返回用户信息（不包含密码）
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { 
        message: "注册成功",
        user: userWithoutPassword 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("注册失败:", error)
    return NextResponse.json(
      { error: "注册失败，请稍后重试" },
      { status: 500 }
    )
  }
} 