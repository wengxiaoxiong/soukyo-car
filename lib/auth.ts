import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { getServerSession } from "next-auth/next"
import { JWT } from "next-auth/jwt"
import { prisma } from "./prisma"
import { UserRole } from "@prisma/client"
import bcrypt from "bcryptjs"

// 判断是否需要刷新 token（比如每5分钟刷新一次）
function shouldRefreshToken(token: JWT): boolean {
  const refreshInterval = 5 * 60 * 1000; // 5分钟
  const iat = typeof token.iat === 'number' ? token.iat : Date.now() / 1000;
  const lastRefresh = (token.lastRefresh as number) || iat * 1000;
  return Date.now() - lastRefresh > refreshInterval;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "邮箱", type: "email" },
        password: { label: "密码", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          isActive: user.isActive,
          preferredLanguage: user.preferredLanguage || 'ja',
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      // 如果有 user 参数（首次登录）
      if (user) {
        // 获取完整的用户信息
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! }
        })
        
        if (dbUser) {
          token.id = dbUser.id
          token.role = dbUser.role
          token.isActive = dbUser.isActive
          token.preferredLanguage = dbUser.preferredLanguage || 'ja'
          
          // 如果是新用户没有角色，设置默认角色
          if (!dbUser.role) {
            try {
              await prisma.user.update({
                where: { id: dbUser.id },
                data: { role: UserRole.USER }
              })
              token.role = UserRole.USER
            } catch (error) {
              console.error("设置用户角色失败:", error)
            }
          }
        }
      }
      
      // 如果是手动触发的更新（比如调用 update()）或者 token 过期需要刷新
      if (trigger === "update" || shouldRefreshToken(token)) {
        // 从数据库获取最新的用户信息
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string }
        })
        
        if (dbUser) {
          token.role = dbUser.role
          token.isActive = dbUser.isActive
          // 只有在手动更新时才更新语言偏好，避免自动刷新时覆盖用户当前选择
          if (trigger === "update") {
            token.preferredLanguage = dbUser.preferredLanguage || 'ja'
          }
          token.lastRefresh = Date.now()
        }
      }
      
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.isActive = token.isActive
        session.user.preferredLanguage = token.preferredLanguage
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return null
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })
    return user
  } catch (error) {
    console.error("获取用户失败:", error)
    return null
  }
}

export async function isAdmin() {
  const user = await getCurrentUser()
  return user?.role === UserRole.ADMIN || user?.role === UserRole.MANAGER
}

// 手动刷新用户 session - 用于角色更新后立即生效
export async function refreshUserSession(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })
    
    if (user) {
      // 这个函数主要用于服务端操作后的提示
      // 客户端需要调用 update() 来刷新 session
      return {
        success: true,
        message: "用户信息已更新，请刷新页面或重新登录以查看最新信息"
      }
    }
    
    return {
      success: false,
      message: "用户不存在"
    }
  } catch (error) {
    console.error("刷新用户 session 失败:", error)
    return {
      success: false,
      message: "刷新失败"
    }
  }
} 