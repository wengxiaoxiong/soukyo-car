import { notFound } from 'next/navigation'

import { StoreForm } from '@/components/admin/StoreForm'
import { getStoreWithCounts } from '../actions'


export default async function StoreDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const storeWithCounts = await getStoreWithCounts(id)

  if (!storeWithCounts) {
    notFound()
  }

  // 分离店面数据和计数数据，只传递店面数据给表单
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _count, ...store } = storeWithCounts

  return <StoreForm store={store} mode="view" />
} 