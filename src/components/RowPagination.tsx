import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination"
import { Button } from "./ui/button"
import { Table } from "@tanstack/react-table"
import { ProblemRow } from "./DataTableContent"

export default function RowPagination({ table } : { table: Table<ProblemRow>}) {
  // render the page state from range(-3, +3) in the pages
  // show first page, show last page

  const pageCount = table.getPageCount();
  const currentPageIndex = table.getState().pagination.pageIndex;
  // const pageRange = Array(end - start + 1).fill().map((_, idx) => start + idx);


  console.log(pageCount, currentPageIndex)

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
          />
        </PaginationItem>

        {[1, 2].map((pageIndex) => (
          <PaginationItem key={pageIndex}>
            <Button
              size="sm"
              variant="outline"
              style={pageIndex - 1 === currentPageIndex ? { backgroundColor: "blue", color: "#fff" } : { backgroundColor: "white" }}
              onClick={() => table.setPageIndex(pageIndex - 1)}
            >{pageIndex}</Button>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>


        {![1, 2, pageCount - 1, pageCount].includes(currentPageIndex + 1) &&
          <PaginationItem>
            <Button
              size="sm"
              variant="outline"
              style={{ backgroundColor: "blue", color: "#fff" }}
              onClick={() => table.setPageIndex(currentPageIndex - 1)}
            >{currentPageIndex + 1}</Button>
          </PaginationItem>
        }

        {currentPageIndex > 1 && (currentPageIndex < pageCount - 2) && <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>}

        {[pageCount - 1, pageCount].map(pageIndex => (
          <PaginationItem key={pageIndex}>
            <Button
              size="sm"
              variant="outline"
              style={pageIndex - 1 === currentPageIndex ? { backgroundColor: "blue", color: "#fff" } : { backgroundColor: "white" }}
              onClick={() => table.setPageIndex(pageIndex - 1)}
            >{pageIndex}</Button>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext 
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}