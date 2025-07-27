import { notFound } from 'next/navigation'
import { PackageForm } from '@/components/admin/PackageForm'
import { getPackageById } from '@/lib/actions/packages'

interface EditPackagePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditPackagePage({ params }: EditPackagePageProps) {
  const { id } = await params
  const packageData = await getPackageById(id)

  if (!packageData) {
    notFound()
  }

  return <PackageForm package={packageData} mode="edit" />
} 