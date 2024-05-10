import { Clock, MoreHorizontal } from "lucide-react";
import { Button } from "./button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./dropdown-menu";
import { useState } from "react";
import { Table } from "@tanstack/react-table";
import { Checkbox } from "./checkbox";
import { ProblemRow } from "../DataTableContent";

const MultiColumnDropdown = ({ table } : { table: Table<ProblemRow> }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={(value) => setIsDropdownOpen(value)}>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="h-8 w-15 py-2 px-0">
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
        <DropdownMenuItem>
          Remove
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
  )
}

export default MultiColumnDropdown;