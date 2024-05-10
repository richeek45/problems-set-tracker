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
import { Table } from "@tanstack/react-table";
import { ProblemRow } from "./DataTableContent";

export function ConfirmUploadDialog({ rows }: { rows: RowType[]}) {
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);

  const router = useRouter();
  const utils = api.useUtils();
  const { toast } = useToast()

  const createManyProblems = api.problem.createManyProblem.useMutation({
    onSuccess: () => {
      router.refresh();
      utils.problem.getAllProblems.invalidate();
      toast({
        title: "SAVED SUCCESSFULLY",
        description: "Problems saved successfully to the database",
      })
      setAlertDialogOpen(false);
    },
    onError: (error) => {
      const zodError = error.data?.zodError?.fieldErrors;
      console.error(error);
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

const getRowIds = (table: Table<ProblemRow>) => {
  const selectedRows = Object.keys(table.getState().rowSelection);
  const rowIds = selectedRows.length ? selectedRows?.map(rowId => table?.getRow(rowId)?.original?.id) : [];
  return rowIds;
}

export function ConfirmDeleteAllDialog({ table } : { table: Table<ProblemRow> }) {
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);

  const router = useRouter();
  const utils = api.useUtils();
  const { toast } = useToast();

  const deleteSelectedProblems = api.problem.deleteMultipleProblems.useMutation({
    onSuccess: () => {
      table.toggleAllRowsSelected(false);
      router.refresh();
      utils.problem.getAllProblems.invalidate();
      toast({
        title: "DELETED SELECTED PROBLEMS SUCCESSFULLY",
        description: "Problems saved successfully to the database",
      })
      setAlertDialogOpen(false);
      
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
    const rowIds = getRowIds(table);
    deleteSelectedProblems.mutate({ problemIds: rowIds })
    toast({
      title: "DELETING SELECTED PROBLEMS...",
      description: "Deleting selected problems",
    })
  }

  return (
    <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button 
          size="sm" 
          variant="ghost" 
          disabled={!getRowIds(table)?.length} 
          className="text-black"
        >Delete</Button>
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
          <AlertDialogAction onClick={handleDeleteSelected}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
