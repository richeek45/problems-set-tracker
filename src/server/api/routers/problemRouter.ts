import { z } from "zod"; 
import { createTRPCRouter, publicProcedure } from "../trpc";
import { Difficulty, Status } from "@prisma/client";

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
  attempts: z.number(),
  tags: z.array(z.string()),
  favourites: z.boolean()

})

export const problemRouter = createTRPCRouter({

  getAllProblems: publicProcedure.query(async ({ ctx }) => {
    const problems = await ctx.db.problem.findMany();
    return problems;
  }),
  createOneProblem: publicProcedure
  .input(formSchema)
  .mutation(async ({ ctx, input }) => {
    const { title, url, difficulty, status, tags, attempts, favourites } = input;
    const problem = await ctx.db.problem.create({
      data: {
        title, url, favourites, status, tags, attempts, difficulty
      }});
    console.log(problem);
    return problem;
  })
})