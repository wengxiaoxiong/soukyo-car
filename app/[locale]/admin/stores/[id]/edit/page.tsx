import { notFound } from 'next/navigation'
import { StoreForm } from '@/components/admin/StoreForm'
import { getStore } from '../../actions'

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

  return <StoreForm store={store} mode="edit" />
} 