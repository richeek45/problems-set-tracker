import { z } from "zod"; 
import { createTRPCRouter, publicProcedure } from "../trpc";

export const problemRouter = createTRPCRouter({
  hello: publicProcedure
  .query(() => {
    return {
      greeting: `Hello`,
    };
  }),


  getAllProblems: publicProcedure.query(async ({ ctx }) => {
    const problems = await ctx.db.problem.findMany();
    return problems;
  }),
  createOneProblem: publicProcedure
  .input(z.object({ title: z.string(), url: z.string()}))
  .mutation(async ({ ctx, input }) => {
    console.log("....input....")
    const { title, url } = input;
    const problem = await ctx.db.problem.create({
      data: {
        title, url, favourites: false, status: "TODO",attempts: 0, difficulty: "EASY", tags: ["array", "tree"] 
      }});
    console.log(problem);
    return problem;
  })
})