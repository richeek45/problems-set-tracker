import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog"
import { Button } from "~/components/ui/button"
import { useToast } from "~/components/ui/use-toast"
import { RowType } from "./inputFiles"
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { useState } from "react"

export function ConfirmUploadDialog({ rows }: { rows: RowType[]}) {
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);

  const router = useRouter();
  const { toast } = useToast()

  const createManyProblems = api.problem.createManyProblem.useMutation({
    onSuccess: () => {
      router.refresh();
      api.useUtils().problem.getAllProblems.invalidate();
      toast({
        title: "SAVED SUCCESSFULLY",
        description: "Problems saved successfully to the database",
      })
      setAlertDialogOpen(false);
    },
    onError: (error) => {
      const zodError = error.data?.zodError?.fieldErrors;
      console.error(zodError);
      toast({
        title: "ERROR SAVING",
        description: "Something went wrong while saving. Please try again later!",
      })
    }
  });

  
  const handleSaveProblemSheet = async () => {
    console.log(rows);
    
    if (!rows.length) {
      // add the toast for showing no rows are added
      toast({
        title: "ERROR SAVING",
        description: "Either the problem sheet is not uploaded or wrong format is added!",
      })
      return;
    }

      toast({
        title: "SAVING",
        description: "Saving the problems...",
      })
      createManyProblems.mutate(rows);
  }


  return (
    <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
      <AlertDialogTrigger asChild>
          <Button variant="outline">Save Problem Sheet</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              The sheet should have <code>tags in Column A and hyperlink in Column B</code>.
              This will save all the problems from the sheet in database
            </AlertDialogDescription>
          </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSaveProblemSheet}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function ConfirmDeleteAllDialog() {
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);

  const router = useRouter();
  const { toast } = useToast()

  const deleteAllProblems = api.problem.deleteSelectedProblems.useMutation({
    onSuccess: () => {
      router.refresh();
      api.useUtils().problem.getAllProblems.invalidate();
      toast({
        title: "DELETED SUCCESSFULLY",
        description: "All Problems were successfully deleted from the database",
      })
    },
    onError: (error) => {
      const zodError = error.data?.zodError?.fieldErrors;
      console.error(zodError);
      toast({
        title: "ERROR SAVING",
        description: "Something went wrong while saving. Please try again later!",
      })
    }
  });

  const handleDeleteProblems = () => {
    deleteAllProblems.mutate();
  }


  return (
    <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Delete Problems</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete all the 
            problems and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteProblems}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
