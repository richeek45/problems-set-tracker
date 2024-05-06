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
import { ToastAction } from "~/components/ui/toast"
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
    },
    onError: (error) => {
      const zodError = error.data?.zodError?.fieldErrors;
      console.error(zodError);
    }
  });

  
  const handleSaveProblemSheet = async () => {
    console.log(rows);
    
    if (!rows.length) {
      // add the toast for showing no rows are added
      toast({
        title: "Error Saving",
        description: "Either the problem sheet is not uploaded or wrong format is added!",
        // action: (
        //   <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
        // ),
      })
      return;
    }

      // await createManyProblems.mutate(rows)
      setAlertDialogOpen(false);

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



  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Show Dialog</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}



export function ToastDemo() {
  const { toast } = useToast()


  return (
    <Button
      variant="outline"
      onClick={() => {
        toast({
          title: "Scheduled: Catch up ",
          description: "Friday, February 10, 2023 at 5:57 PM",
          action: (
            <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
          ),
        })
      }}
    >
      Add to calendar
    </Button>
  )
}
