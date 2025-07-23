import { notFound } from 'next/navigation'
import { VehicleForm } from '@/components/admin/VehicleForm'
import { getVehicleWithStore } from '../actions'

interface VehiclePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function VehiclePage({ params }: VehiclePageProps) {
  const { id } = await params
  const vehicle = await getVehicleWithStore(id)

  if (!vehicle) {
    notFound()
  }

  return <VehicleForm vehicle={vehicle} mode="view" />
} 