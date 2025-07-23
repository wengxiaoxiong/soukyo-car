import { notFound } from 'next/navigation'
import { VehicleForm } from '@/components/admin/VehicleForm'
import { getVehicleWithStore } from '../../actions'

interface EditVehiclePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditVehiclePage({ params }: EditVehiclePageProps) {
  const { id } = await params
  const vehicle = await getVehicleWithStore(id)

  if (!vehicle) {
    notFound()
  }

  return <VehicleForm vehicle={vehicle} mode="edit" />
} 