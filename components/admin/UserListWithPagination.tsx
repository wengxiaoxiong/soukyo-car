"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import { PaginationControls } from '@/components/PaginationControls'

interface UserListWithPaginationProps {
  currentPage: number
  totalPages: number
  children: React.ReactNode
}

export function UserListWithPagination({ 
  currentPage, 
  totalPages, 
  children 
}: UserListWithPaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`?${params.toString()}`)
  }

  return (
    <>
      {children}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </>
  )
} 