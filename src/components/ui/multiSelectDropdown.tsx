import { Clock, MoreHorizontal } from "lucide-react";
import { Button } from "./button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./dropdown-menu";
import { useState } from "react";

const MultiColumnDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={(value) => setIsDropdownOpen(value)}>
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
        <DropdownMenuItem
        >
          Mark as Completed
        </DropdownMenuItem>
        <DropdownMenuItem>
          Start the timer <span><Clock/></span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {
        }}>
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

export default MultiColumnDropdown;