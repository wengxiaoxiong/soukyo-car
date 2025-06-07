"use client"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null

  const renderPageNumbers = () => {
    const items = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      // 如果总页数小于等于5，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href={`?page=${i}`}
              isActive={currentPage === i}
              onClick={(e) => {
                e.preventDefault()
                onPageChange(i)
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      }
    } else {
      // 如果总页数大于5，使用省略号逻辑
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="?page=1"
            isActive={currentPage === 1}
            onClick={(e) => {
              e.preventDefault()
              onPageChange(1)
            }}
          >
            1
          </PaginationLink>
        </PaginationItem>
      )

      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        )
      }

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                href={`?page=${i}`}
                isActive={currentPage === i}
                onClick={(e) => {
                  e.preventDefault()
                  onPageChange(i)
                }}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          )
        }
      }

      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        )
      }

      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              href={`?page=${totalPages}`}
              isActive={currentPage === totalPages}
              onClick={(e) => {
                e.preventDefault()
                onPageChange(totalPages)
              }}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )
      }
    }

    return items
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={`?page=${Math.max(1, currentPage - 1)}`}
            onClick={(e) => {
              e.preventDefault()
              if (currentPage > 1) {
                onPageChange(currentPage - 1)
              }
            }}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        
        {renderPageNumbers()}
        
        <PaginationItem>
          <PaginationNext
            href={`?page=${Math.min(totalPages, currentPage + 1)}`}
            onClick={(e) => {
              e.preventDefault()
              if (currentPage < totalPages) {
                onPageChange(currentPage + 1)
              }
            }}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
} 