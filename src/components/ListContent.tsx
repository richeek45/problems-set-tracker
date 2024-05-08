import { DataTableSet } from "./DataTableContent";
import { api } from "~/trpc/server";
import { auth } from "~/server/auth";
import { Status } from "@prisma/client";
import { RouterOutputs } from "~/trpc/react";


export default async function ListContent() {
  const user = await auth();

  const allProblems = user ? await api.problem.getAllUserProblems() : await api.problem.getAllProblems();
  
  console.log(user, allProblems, "client side user")

  let allProblemsTransformed = [];
  allProblemsTransformed = allProblems?.map((problem) => ({
    id: problem.id,
    tags: problem.tags,
    difficulty: problem.difficulty,
    status: Status.TODO, // case for no user signed in
    attempts: 0,
    favourites: false,
    url: {
      problem_number: problem.problem_number,
      title: problem.title,
      link: problem.url
    },
    createdAt: problem.createdAt,
    updatedAt: problem.updatedAt,
  }));

  if (user) {
    allProblemsTransformed = allProblems?.map((problem) => ({
      id: problem.id,
      tags: problem.tags,
      difficulty: problem.difficulty,
      status: problem.status[0].status,
      attempts: problem.attempts[0].attempts,
      favourites: problem.favouritedBy[0]?.id ? true : false,
      url: {
        problem_number: problem.problem_number,
        title: problem.title,
        link: problem.url
      },
      createdAt: problem.createdAt,
      updatedAt: problem.updatedAt,
    }));
  }
  

  return (<DataTableSet data={allProblemsTransformed} />)
}
