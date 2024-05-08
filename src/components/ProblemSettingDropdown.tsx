"use client"

import { Clock, MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useState } from "react";
import { ProblemRow } from "./DataTableContent";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import CreateListItem from "./createListItem";
import { Status } from "@prisma/client";
import { useToast } from "./ui/use-toast";

const ProblemSettingDropdown = ({ rowValues } : { rowValues: ProblemRow }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const router = useRouter();
  const utils = api.useUtils();
  const { toast } = useToast();

  const markComplete = api.problem.markCompleted.useMutation({  
    onSuccess: () => {
    router.refresh();
    utils.problem.getAllProblems.invalidate();
    toast({
      title: "MARK COMPLETED",
      description: "Successfully marked the problem as complete!",
    })
    },
    onError: (error) => {
      const errorMessage = error.data?.zodError?.fieldErrors.content![0];
      console.log(error, "Error.........");    
      toast({
        title: "ERROR SAVING",
        description: "Error updating the problem!",
      })
    }
  })

  const resetProgressById = api.problem.resetProgressById.useMutation({
    onSuccess: () => {
      router.refresh();
      utils.problem.getAllProblems.invalidate();
      toast({
        title: "RESET PROGRESS",
        description: "Successfully marked the problem as complete!",
      })
    },
    onError: (error) => {
      const errorMessage = error.data?.zodError?.fieldErrors.content![0];
      console.log(error, "Error.........");
      toast({
        title: "ERROR SAVING",
        description: "Error resetting the problem!",
      })  
    }
  })

  const deleteProblemById = api.problem.deleteProblemById.useMutation({
    onSuccess: () => {
      router.refresh();
      utils.problem.getAllProblems.invalidate();
      toast({
        title: "DELETED",
        description: "Successfully marked the problem as complete!",
      })
    },
    onError: (error) => {
      const errorMessage = error.data?.zodError?.fieldErrors.content![0];
      console.log(error, "Error.........");
      toast({
        title: "ERROR SAVING",
        description: "Error deleting the problem!",
      })  
    }
  })

  const handleDeleteProblem = () => {
    // test delete 
    // deleteProblemById.mutate({ problemId: rowValues.id })
  }

  const resetProgress = () => {
    resetProgressById.mutate({ id: rowValues.id });
    // add a toast message saying resetting...
  }


  return (
    <div>
      <CreateListItem 
        type="edit" 
        id={rowValues.id} 
      />
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Modify</DropdownMenuLabel>
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
              Start the timer &nbsp;<span><Clock/></span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => resetProgress()}>
              Reset Progress
            </DropdownMenuItem>

            <DropdownMenuGroup >
              <DropdownMenuSub>

              <DropdownMenuSubTrigger>
                {/* <UserPlus className="mr-2 h-4 w-4" /> */}
                <span>Edit Column</span>
              </DropdownMenuSubTrigger>

              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>


                  <DropdownMenuGroup>
                    <DropdownMenuSub>

                      <DropdownMenuSubTrigger>
                        <span>Status</span>
                      </DropdownMenuSubTrigger>

                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          {[Status.TODO, Status.INPROGRESS, Status.COMPLETED, Status.REPEAT].map(status => (
                            <DropdownMenuItem key={status} >
                              {status}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  </DropdownMenuGroup>

                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    {/* <MessageSquare className="mr-2 h-4 w-4" /> */}
                    <span>Difficulty</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    {/* <PlusCircle className="mr-2 h-4 w-4" /> */}
                    <span>More...</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>

              </DropdownMenuSub>
            </DropdownMenuGroup>


            <DropdownMenuItem onClick={handleDeleteProblem}>
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              Remove
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
} 

export default ProblemSettingDropdown;