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
import { useRouter } from "next/navigation";
// import toast, { Toaster } from 'react-hot-toast';

import { zodResolver } from "@hookform/resolvers/zod"
import { Difficulty, Status } from "@prisma/client"
import { Controller, useForm } from "react-hook-form"
import { toast } from "~/components/ui/use-toast"
import { z } from "zod"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useState } from "react";

interface InputParameters {
  title: string,
  url: string,
  favourites: boolean,
  difficulty: Difficulty,
  status: Status,
  attempts: number,
  tags: string[]
}


const initialInputParameters = {
  title: "",
  url: "",
  favourites: false,
  difficulty: Difficulty.EASY,
  status: Status.TODO,
  attempts: 0,
  tags: []
}

const inputFieldParameters = [
  {
    name: "title",
    formLabel: "Title",
    placeholder: "Enter the title..."
  },
  {
    name: "url",
    formLabel: "Url",
    placeholder: "Enter the url..."
  }

]

const selectFieldParameters = [
  {
    name: "status",
    formLabel: "Status",
    placeholder: "Enter the status...",
    options: [Status.TODO, Status.INPROGRESS, Status.COMPLETED, Status.REPEAT],
  },
  {
    name: "difficulty",
    formLabel: "Difficulty",
    placeholder: "Difficulty of the problem",
    options: [Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD]
  },
  {
    name: "tags",
    formLabel: "Tags",
    placeholder: "Select tags for the problem",
    options: ["array", "tree", "graph", "string"]
  }
]

type Schema = z.infer<typeof formSchema>


const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be 5 characters long"
  }),
  url: z.string({
    required_error: "Title is required"
  }).url({
    message: "Not a valid url"
  }).min(5, {
    message: "Url must be 10 characters long"
  }),
  status: z.enum([Status.TODO, Status.INPROGRESS, Status.COMPLETED, Status.REPEAT]),
  difficulty: z.enum([Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD]),
  tags: z.string({
    required_error: "A topic is required"
  }).min(2)
})

export default function CreateListItem() {
  const router = useRouter();
  const utils = api.useUtils();


  // const allProblems = api.problem.getAllProblems.useQuery();
  // console.log(allProblems.data, "...allProblems....")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      url: "",
      status: Status.TODO,
      difficulty: Difficulty.EASY,
      tags: ""
    }
  })

  const createProblem = api.problem.createOneProblem.useMutation({
    onSuccess: () => {
      router.refresh();
      utils.problem.getAllProblems.invalidate();
      
    }, 
    onError: (error) => {
      const errorMessage = error.data?.zodError?.fieldErrors.content![0];
      console.log(error, "Error.........");
      if (errorMessage) {
        // toast.error(errorMessage);
      } else {
        // toast.error("Failed to post! Please try again later!");
      }
    }
  })

  const createNewProblem = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    const defaultParameters = { tags: [values.tags], favourites: false, attempts: 0 }
    const finalValues = { ...values, ...defaultParameters };
    console.log(finalValues)

    const { attempts, difficulty, favourites, status, tags, title, url } = finalValues;

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(finalValues, null, 2)}</code>
        </pre>
      ),
    })


    createProblem.mutate({ attempts, difficulty, favourites, status, tags, title, url });
  }

  return (
    <Dialog >
      <DialogTrigger asChild>
        <Button size="sm" >Add New Problem</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] h-[75%]">
        <DialogHeader>
          <DialogTitle>Add New Problem</DialogTitle>
          <DialogDescription>
            Fill the values for your problem. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(createNewProblem)} >
            {inputFieldParameters.map(param => (
              <div key={param.name}  className="h-[100px] mb-4">
              <FormField
                control={form.control}
                name={param.name}
                
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{param.formLabel}</FormLabel>
                    <FormControl>
                      <Input placeholder={param.placeholder} {...field} />
                    </FormControl>
                    <FormMessage className="text-[14px]" />
                  </FormItem>
                )}
              />
            </div>

            ))}

            {selectFieldParameters.map(params => (
              <div key={params.name} className="my-2">
                <FormField
                  name={params.name}
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={params.placeholder} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {params.options.map(value => (
                            <SelectItem key={value} value={value}>{value.toUpperCase()}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            
            <DialogFooter>
              <Button type="submit">{createProblem.isPending ? "Saving..." : "Save changes"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}