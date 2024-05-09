import { Clock, MoreHorizontal } from "lucide-react";
import { Button } from "./button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./dropdown-menu";
import { useState } from "react";
import { Table } from "@tanstack/react-table";
import { Checkbox } from "./checkbox";
import { ProblemRow } from "../DataTableContent";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { useToast } from "./use-toast";

const MultiColumnDropdown = ({ table } : { table: Table<ProblemRow> }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const router = useRouter();
  const utils = api.useUtils();
  const { toast } = useToast();

  const deleteSelectedProblems = api.problem.deleteMultipleProblems.useMutation({
    onSuccess: () => {
      router.refresh();
      utils.problem.getAllProblems.invalidate();
      toast({
        title: "DELETED SELECTED PROBLEMS SUCCESSFULLY",
        description: "Problems saved successfully to the database",
      })
      setIsDropdownOpen(false);
      
    }, 
    onError: (error) => {
      const errorMessage = error.data?.zodError?.fieldErrors.content![0];
      console.log(error, "Error.........");
      if (errorMessage) {
        toast({
          title: "ERROR DELETING SELECTED PROBLEMS",
          description: errorMessage,
        })
      } else {
        toast({
          title: "ERROR DELETING",
          description: "Failed to delete selected problems!",
        })
      }
    }
  });


  const handleDeleteSelected = () => {
    const selectedRows = Object.keys(table.getState().rowSelection);
    const rowIds = selectedRows.map(rowId => table.getRow(rowId).original.id);
    console.log(selectedRows, rowIds)

    deleteSelectedProblems.mutate({ problemIds: rowIds })
  } 

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={(value) => setIsDropdownOpen(value)}>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="h-8 w-20 ml-6">
        <span className="sr-only">Open menu</span>
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>Mutiple Select Action</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem
        >
          Mark as Completed
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Checkbox 
            checked={table.getIsAllRowsSelected()}
            onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
            aria-label="Select all"
          />
          &nbsp;Select All Problems
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {}}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDeleteSelected}>
          Delete Selected
        </DropdownMenuItem>
        <DropdownMenuItem>
          Remove
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
  )
}

export default MultiColumnDropdown;