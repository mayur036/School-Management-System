import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const AppPagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  itemsLabel = 'items',
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1 && totalItems === 0) return null;

  const startOffset =
    totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endOffset = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate pagination items
  const renderPageItems = () => {
    const pageItems = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageItems.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pageItems.push(1, 2, 3, 4, 'ellipsis', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageItems.push(
          1,
          'ellipsis',
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pageItems.push(
          1,
          'ellipsis',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          'ellipsis',
          totalPages
        );
      }
    }

    return pageItems.map((page, index) => {
      if (page === 'ellipsis') {
        return (
          <PaginationItem key={`ellipsis-${index}`}>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      return (
        <PaginationItem key={page}>
          <PaginationLink
            className="size-8 cursor-pointer rounded-lg text-xs font-semibold"
            isActive={page === currentPage}
            onClick={(e) => {
              e.preventDefault();
              onPageChange(page);
            }}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    });
  };

  return (
    <div className="flex flex-col gap-4 px-1 py-3 text-xs sm:flex-row sm:items-center sm:justify-between">
      {/* Total count details */}
      <div className="text-muted-foreground text-center font-medium sm:text-left">
        Showing{' '}
        <span className="text-foreground font-semibold">{startOffset}</span> to{' '}
        <span className="text-foreground font-semibold">{endOffset}</span> of{' '}
        <span className="text-foreground font-semibold">{totalItems}</span>{' '}
        {itemsLabel}
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-end">
        {/* Pagination buttons */}
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                text=""
                className={`size-8 cursor-pointer rounded-lg border p-0.5 text-xs ${
                  currentPage === 1 ? 'pointer-events-none opacity-40' : ''
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) onPageChange(currentPage - 1);
                }}
              />
            </PaginationItem>

            {renderPageItems()}

            <PaginationItem>
              <PaginationNext
                text=""
                className={`size-8 cursor-pointer rounded-lg border p-0.5 text-xs ${
                  currentPage === totalPages
                    ? 'pointer-events-none opacity-40'
                    : ''
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) onPageChange(currentPage + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        {/* Page size dropdown */}
        {onItemsPerPageChange && (
          <div className="flex items-center gap-2">
            <Select
              value={String(itemsPerPage)}
              onValueChange={(val) => onItemsPerPageChange(Number(val))}
            >
              <SelectTrigger className="border-border bg-card h-8 w-25 rounded-lg text-[11px]">
                <SelectValue placeholder="Page size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 / page</SelectItem>
                <SelectItem value="10">10 / page</SelectItem>
                <SelectItem value="20">20 / page</SelectItem>
                <SelectItem value="50">50 / page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppPagination;
