import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  // Calculate the range of pages to display
  const getVisiblePageRange = () => {
    if (totalPages <= maxVisiblePages) {
      // Show all pages if there are less than the max visible
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first and last page, and pages around current page
    const sidePages = Math.floor((maxVisiblePages - 2) / 2); // Pages to show on each side of current page
    const startPage = Math.max(2, currentPage - sidePages);
    const endPage = Math.min(totalPages - 1, currentPage + sidePages);

    const pages: (number | "ellipsis-start" | "ellipsis-end")[] = [1];

    // Add ellipsis at the start if needed
    if (startPage > 2) {
      pages.push("ellipsis-start");
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis at the end if needed
    if (endPage < totalPages - 1) {
      pages.push("ellipsis-end");
    }

    // Add last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePageRange();

  return (
    <div className="flex">
      <Button
        variant="outline"
        size="icon"
        className="mr-2"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {visiblePages.map((page, index) => {
        if (page === "ellipsis-start" || page === "ellipsis-end") {
          return (
            <Button
              key={`ellipsis-${index}`}
              variant="outline"
              size="icon"
              className="mr-2"
              disabled
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          );
        }

        return (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            className="mr-2"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        );
      })}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
