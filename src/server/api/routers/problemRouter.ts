import { z } from "zod"; 
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
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

  getProblemById: publicProcedure
  .input(z.object({ id: z.string()}))
  .query(async ({ ctx, input }) => {
    const { id } = input;
    return await ctx.db.problem.findFirst({ where: { id } })
  }),

  getAllProblems: publicProcedure.query(async ({ ctx }) => {
    // skip: Value, take: value
    // const { skip, take } = input;
    const problems = await ctx.db.problem.findMany();
    return problems;
  }),
  createOneProblem: protectedProcedure
  .input(formSchema)
  .mutation(async ({ ctx, input }) => {
    const { title, url, difficulty, status, tags, attempts, favourites } = input;
    const problem = await ctx.db.problem.create({
      data: {
        title, url, favourites, status, tags, attempts, difficulty
      }});
    console.log(problem);
    return problem;
  }),

  updateProblemById: protectedProcedure
  .input(formSchema.extend({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const { id, title, url, difficulty, status, tags, favourites, attempts } = input;
    const problem = await ctx.db.problem.update({
      where: { id },
      data: {
        title, url, favourites, status, tags, attempts, difficulty
      }});
    console.log(problem);
    return problem;

  }),

  toggleProblemFavourite: protectedProcedure
  .input(z.object({ favourite: z.boolean(), id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const { favourite, id } = input;
    return await ctx.db.problem.update({
      data: { favourites: !favourite },
      where: {
        id
      }
    })
  }),

  markCompleted: protectedProcedure
  .input(z.object({ 
    id: z.string(), 
    attempts: z.number(), 
    status: z.enum([Status.TODO, Status.INPROGRESS, Status.COMPLETED, Status.REPEAT]) 
  }))
  .mutation(async ({ ctx, input }) => {
    const { id, attempts, status } = input;

    return ctx.db.problem.update({
      where: { id },
      data: { attempts: attempts + 1, status: Status.COMPLETED }
    })
  })

})