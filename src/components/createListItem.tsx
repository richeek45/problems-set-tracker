"use client";

import { api } from "~/trpc/react";
import { SelectTopics } from "./selectFields";
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';

export default function CreateListItem() {
  const router = useRouter();
  const utils = api.useUtils();

  const allProblems = api.problem.getAllProblems.useQuery();
  console.log(allProblems.data, "...allProblems....")

  const createProblem = api.problem.createOneProblem.useMutation({
    onSuccess: () => {
      router.refresh();
      utils.problem.getAllProblems.invalidate();
      
    }, 
    onError: (error) => {
      const errorMessage = error.data?.zodError?.fieldErrors.content![0];
      console.log(error, "Error.........");
      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.error("Failed to post! Please try again later!");
      }
    }
  })

  const createNewProblem = () => {
    createProblem.mutate({ 
      title: "Find the maximum and minimum element in an array", 
      url: "https://www.geeksforgeeks.org/maximum-and-minimum-in-an-array/" 
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">Add New Problem</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Problem</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Title
            </Label>
            <Input
              id="name"
              defaultValue="Pedro Duarte"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
            URL Link
            </Label>
            <Input
              id="username"
              defaultValue="#"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-1 items-center gap-4">
            <SelectTopics />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
            Difficulty
            </Label>
            <Input
              id="username"
              defaultValue="array"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={createNewProblem} >{createProblem.isPending ? "Loading ..." : "Save changes"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}