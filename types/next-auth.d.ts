import { UserRole } from "@/lib/generated/prisma"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role: UserRole
      isActive: boolean
    }
  }

  interface User {
    id: string
    email: string
    name?: string | null
    image?: string | null
    role: UserRole
    isActive?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: UserRole
    isActive: boolean
  }
} 