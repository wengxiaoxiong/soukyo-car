import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"
import { UserRole } from "@/lib/generated/prisma"

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
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // 获取完整的用户信息
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! }
        })
        
        if (dbUser) {
          token.id = dbUser.id
          token.role = dbUser.role
          token.isActive = dbUser.isActive
          
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
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.isActive = token.isActive
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
  const { getServerSession } = await import("next-auth/next")
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