import { notFound } from 'next/navigation'
import { PackageForm } from '@/components/admin/PackageForm'
import { getPackageById } from '@/lib/actions/packages'

interface PackagePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PackagePage({ params }: PackagePageProps) {
  const { id } = await params
  const packageData = await getPackageById(id)

  if (!packageData) {
    notFound()
  }

  return <PackageForm package={packageData} mode="view" />
} 