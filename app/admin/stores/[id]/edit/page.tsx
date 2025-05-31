import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { StoreForm } from '@/components/admin/StoreForm'

async function getStore(id: string) {
  try {
    const store = await prisma.store.findUnique({
      where: { id },
    })
    return store
  } catch (error) {
    console.error('获取店面信息失败:', error)
    return null
  }
}

export default async function EditStorePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const store = await getStore(id)

  if (!store) {
    notFound()
  }

  // 转换 openingHours 类型以匹配 StoreForm 的期望类型
  const storeForForm = {
    ...store,
    openingHours: store.openingHours as Record<string, unknown> | null
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">编辑店面</h1>
        <p className="text-gray-600 mt-2">修改店面信息</p>
      </div>

      <StoreForm store={storeForForm} isEdit={true} />
    </div>
  )
} 