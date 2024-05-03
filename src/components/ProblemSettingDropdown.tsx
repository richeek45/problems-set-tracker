"use client"

import { Clock, MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useState } from "react";
import { ProblemRow } from "./DataTableContent";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import CreateListItem from "./createListItem";

const ProblemSettingDropdown = ({ rowValues } : { rowValues: ProblemRow }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const router = useRouter();
  const utils = api.useUtils();

  const markComplete = api.problem.markCompleted.useMutation({  
    onSuccess: () => {
    router.refresh();
    utils.problem.getAllProblems.invalidate();
    },
    onError: (error) => {
      const errorMessage = error.data?.zodError?.fieldErrors.content![0];
      console.log(error, "Error.........");    
    }
  })

  const handleDropdownChange = (value: boolean, source: string) => {
    // if dialog is open, dropdown is open -> else take the original dropdown value
    console.log(value, source)
    if (isDialogOpen === true) {
      setIsDropdownOpen(true);
      return;
    }
    setIsDropdownOpen(value)
  }


  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={(value) => handleDropdownChange(value, "dropdown")}>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="h-8 w-8 p-0">
        <span className="sr-only">Open menu</span>
        <MoreHorizontal className="h-4 w-4" />
        {isDialogOpen && <CreateListItem 
            type="edit" 
            isDialogOpen={isDialogOpen} 
            setIsDialogOpen={setIsDialogOpen} 
            id={rowValues.id} 
            handleDropdownChange={handleDropdownChange} 
          />}
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>Extra Section</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem
          onClick={() => markComplete.mutate({ 
            id: rowValues.id, 
            status: rowValues.status, 
            attempts: rowValues.attempts
          })}
        >
          Mark as Completed
        </DropdownMenuItem>
        <DropdownMenuItem>
          Start the timer <span><Clock/></span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {
          if (!isDialogOpen) {
            setIsDialogOpen(true)
          }
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

export default ProblemSettingDropdown;