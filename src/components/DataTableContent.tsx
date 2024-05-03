"use client"

import { useMemo, useState } from "react"
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
import { ArrowUpDown, ChevronDown, MoreHorizontal, Star, Clock } from "lucide-react"

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
import { api } from "~/trpc/react"
import { Difficulty, Status } from "@prisma/client"
import { useRouter } from "next/navigation"
import { ColumnFieldSelection } from "./columnFieldSelection"
import ProblemSettingDropdown from "./ProblemSettingDropdown"

type SortMap = {
  [key in Difficulty]: number
}

type Url = {
  problem_number: number,
  title: string,
  link: string,
}

export interface ProblemRow {
  id: string,
  tags: string[],
  status: Status,
  url: Url,
  attempts: number,
  difficulty: Difficulty,
  favourites: boolean,
  createdAt: Date,
  updatedAt: Date | null
}


export const DataTableSet = ({ data, columns } : { data: ProblemRow[], columns: any[]}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 4
  });
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilterSelection, setColumnFilterSelection] = useState("url");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    rowCount: data.length,
    defaultColumn: {
      size: 200, //starting column size
      minSize: 50, //enforced during column resizing
      maxSize: 250, //enforced during column resizing
    },
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
        <CreateListItem type="add" isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
      </div>

      <div className="flex items-center py-4 px-2 gap-4">
        <Input 
          placeholder="Filter questions...."
          value={table.getColumn(columnFilterSelection)?.getFilterValue() as string ?? ""}
          onChange={(event) => {
            console.log(event.target.value)
            table.getColumn(columnFilterSelection)?.setFilterValue(event.target.value)
          }}
          className="max-w-sm"
        />
        <ColumnFieldSelection columnFilterSelection={columnFilterSelection} setColumnFilterSelection={setColumnFilterSelection} />

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
  const router = useRouter();
  const utils = api.useUtils();

  const toggleFavourite = api.problem.toggleProblemFavourite.useMutation({
    onSuccess: () => {
      router.refresh();
      utils.problem.getAllProblems.invalidate();
    },
    onError: (error) => {
      const errorMessage = error.data?.zodError?.fieldErrors.content![0];
      console.log(error, "Error.........");    
    }
  });

  const columns: ColumnDef<ProblemRow>[] = useMemo(() => [
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
      size: 50,
      cell: ({ row }) => {
  
      /*
        Explaining the vulnerability issue for target="_blank" and adding ref="noopener noreferer"
        https://stackoverflow.com/questions/50709625/link-with-target-blank-and-rel-noopener-noreferrer-still-vulnerable
      */
        const url = row.getValue("url") as Url;
        return (
          <Button variant="link">
            <Link 
              href={url.link ?? ""}
              target="_blank"
              rel="noopener noreferrer" 
              className="text-right font-medium hover:underline hover:text-sky-500">
              {url.problem_number}. {url.title}
            </Link>
          </Button>
        )
      },
      filterFn: (row, columnId, filterValue) => {
        const title = row.original.url.title.toLowerCase();
        return title.includes(filterValue.toLowerCase());
      }
    },
    {
      accessorKey: "tags",
      header: "Tags",
      cell: ({ row }) => <div>{row.getValue("tags")}</div>,
      filterFn: (row, columnId, filterValue) => {
        // tags is an array field - filter based on match of array values...
        const tags = row.original.tags; 
        return tags.some((tag) =>  (tag.includes(filterValue)));
      }
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
      accessorKey: "favourites",
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
        onClick={() => {
          toggleFavourite.mutate({ favourite: row.getValue("favourites"), id: row.original.id })
        }}
      >{row.getValue("favourites") ? <Star fill="#FBB03B" stroke="#FBB03B" /> : <Star stroke="#FBB03B" />}</Button>
    },
    {
      accessorKey: "attempts",
      sortingFn: "alphanumeric",
      filterFn: (row, columnId, filterValue) => {
        const attempts = Number(row.original.attempts);
        return attempts === Number(filterValue);
      },
      header: ({ column }) => (
        <Button 
          variant="ghost"
          onClick={() => column.toggleSorting()}>
            Attempts
            <ArrowUpDown />
          </Button>
      ),
      cell: ({ row }) => {
        return <div>{row.getValue("attempts")}</div>
      }
    },
    {
      id: "action",
      enableHiding: false,
      cell: ({ row }) => {
        const rowValues = row.original;
        return (
        <ProblemSettingDropdown rowValues={rowValues} />
        )
      }
    }
  ],[])

  const { data } = api.problem.getAllProblems.useQuery();

  if (!data) return;

  const allProblems = data.map((problem) => ({
    id: problem.id,
    status: problem.status,
    tags: problem.tags,
    attempts: problem.attempts,
    difficulty: problem.difficulty,
    favourites: problem.favourites,
    createdAt: problem.createdAt,
    updatedAt: problem.updatedAt,
    url: {
      problem_number: problem.problem_number,
      title: problem.title,
      link: problem.url
    }
  }));
  

  return (<DataTableSet data={allProblems} columns={columns} />)
}
