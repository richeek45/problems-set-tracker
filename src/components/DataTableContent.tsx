"use client"

import { useState } from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Star } from "lucide-react"

import { Button } from "~/components/ui/button"
import { Checkbox } from "~/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Input } from "~/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import CreateListItem from "./createListItem"
import { InputFile } from "./inputFiles"
import Link from "next/link"

enum Status {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  REPEAT = "REPEAT" 
}

enum Difficulty {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD"
}

type SortMap = {
  [key in Difficulty]: number
}

type Url = {
  title: string,
  link: string,
}

export interface ProblemRow {
  id: string,
  tags: string[],
  status: Status,
  problem_number: number,
  url: Url,
  frequency: number,
  difficulty: Difficulty,
  favourite: boolean
}

const data: ProblemRow[] = [
  {
    id: "ljdflsd",
    tags: ["array"],
    problem_number: 1,
    status: Status.TODO,
    url: {
      title: "Reverse an array",
      link: "https://www.geeksforgeeks.org/program-to-reverse-an-array/",
    },
    frequency: 0,
    difficulty: Difficulty.EASY,
    favourite: true,
  },
  {
    id: "woiejis",
    tags: ["string"],
    problem_number: 1,
    status: Status.TODO,
    url: {
      title: "Reverse an array",
      link: "https://www.geeksforgeeks.org/program-to-reverse-an-array/",
    },
    frequency: 0,
    difficulty: Difficulty.EASY,
    favourite: false,
  },
  {
    id: "sdilj2k4",
    tags: ["array"],
    problem_number: 1,
    status: Status.TODO,
    url: {
      title: "Reverse an array",
      link: "https://www.geeksforgeeks.org/program-to-reverse-an-array/",
    },
    frequency: 0,
    difficulty: Difficulty.MEDIUM,
    favourite: true,
  },
  {
    id: "d93jke3",
    tags: ["array"],
    problem_number: 1,
    status: Status.TODO,
    url: {
      title: "Reverse an array",
      link: "https://www.geeksforgeeks.org/program-to-reverse-an-array/",
    },
    frequency: 0,
    difficulty: Difficulty.HARD,
    favourite: false,
  },
  {
    id: "30jdskds",
    tags: ["array"],
    problem_number: 1,
    status: Status.TODO,
    url: {
      title: "Reverse an array",
      link: "https://www.geeksforgeeks.org/program-to-reverse-an-array/",
    },
    frequency: 0,
    difficulty: Difficulty.EASY,
    favourite: true,
  },
  {
    id: "3funaad",
    tags: ["array"],
    problem_number: 1,
    status: Status.TODO,
    url: {
      title: "Reverse an array",
      link: "https://www.geeksforgeeks.org/program-to-reverse-an-array/",
    },
    frequency: 0,
    difficulty: Difficulty.MEDIUM,
    favourite: false,
  },

]

export const columns: ColumnDef<ProblemRow>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox 
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox 
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: true,
    enableColumnFilter: true,
    enableHiding: false
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div>
  },
  {
    accessorKey: "url",
    header: "Problem",
    cell: ({ row }) => {

    /*
      Explaining the vulnerability issue for target="_blank" and adding ref="noopener noreferer"
      https://stackoverflow.com/questions/50709625/link-with-target-blank-and-rel-noopener-noreferrer-still-vulnerable
    */
      const url = row.getValue("url") as Url;
      return (
        <Link 
          href={url.link ?? ""}
          target="_blank"
          rel="noopener noreferrer" 
          className="text-right font-medium hover:underline hover:text-sky-300">
          {url.title}
        </Link>
      )
    },
    filterFn: (row, columnId, filterValue) => {
      const title = row.original.url.title;
      return title.includes(filterValue);
    }
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => <div>{row.getValue("tags")}</div>
  },
  {
    accessorKey: "difficulty",
    sortingFn: (rowA, rowB, columnId) => {
      
      const sortMap: SortMap = { "EASY": 0, "MEDIUM": 1, "HARD": 2 };
      const row1 = rowA.getValue("difficulty") as Difficulty;
      const row2 = rowB.getValue("difficulty") as Difficulty;
      return sortMap[row1] - sortMap[row2];
    },
    header: ({ column }) => {
      return (
        <Button 
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Difficulty
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
      )
    },
    cell: ({ row }) => {
      return (<div>{row.getValue("difficulty")}</div>) 
    }
  },
  {
    accessorKey: "favourite",
    header: ({ column }) => {
      return (
        <Button 
          variant="ghost"
          onClick={() => column.toggleSorting()}
          >
            Favourite
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
      )
    },
    cell: ({ row }) => <Button
      variant="ghost"
      size="sm"
    >{row.getValue("favourite") ? <Star fill="#FBB03B" stroke="#FBB03B" /> : <Star stroke="#FBB03B" />}</Button>
  },

  {
    id: "action",
    enableHiding: false,
    cell: ({ row }) => {
      const x = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Extra Section</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem>
                Remove
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

export const DataTableSet = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 4
  });
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data, 
    columns, 
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    rowCount: 6,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination
    }
  })

  const tableRows = table.getRowModel().rows;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between px-10 py-2">
        <InputFile />
        <CreateListItem />
      </div>
      {/* 
      <TableHead>Frequency</TableHead>
      <TableHead>Time</TableHead>
      */}

      <div className="flex items-center py-4">
        <Input 
          placeholder="Filter questions...."
          value={table.getColumn("url")?.getFilterValue() as string ?? ""}
          onChange={(event) => {
            console.log(event.target.value)
            table.getColumn("url")?.setFilterValue(event.target.value)
          }}
          className="max-w-sm"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" >
            {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => {

              return (
                <DropdownMenuCheckboxItem 
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              )
            })
            }
          </DropdownMenuContent>
        </DropdownMenu>
      </div>


      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {tableRows?.length ? 
              tableRows.map(row => (
                <TableRow 
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}  
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
              </TableRow>
              ))
            : <TableRow>
                <TableCell colSpan={columns.length} className="text-center h-24">No Results</TableCell>
            </TableRow>
          }
          </TableBody>
        </Table>
      </div>


      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
        </div>
    </div>
  )

}

export default function ListContent() {
  return (<DataTableSet />)
}
