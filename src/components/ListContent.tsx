import { DataTableSet } from "./DataTableContent";
import { api } from "~/trpc/server";
import { auth } from "~/server/auth";
import { Session, Status } from "@prisma/client";
import { RouterOutputs } from "~/trpc/react";

export default async function ListContent() {
  const user = await auth();

  if (user) {
    <AllProblemsWithUserData />
  }

  <AllProblemsGlobal />
}

const AllProblemsGlobal = async () => {
  const allProblems = await api.problem.getAllProblems();

  const allProblemsTransformed = allProblems?.map((problem) => ({
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
  
  return (<DataTableSet data={allProblemsTransformed} />)
}

const AllProblemsWithUserData = async () => {

  const allProblems = await api.problem.getAllUserProblems();

  const allProblemsTransformed = allProblems?.map((problem) => ({
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

  return (<DataTableSet data={allProblemsTransformed} />)
}