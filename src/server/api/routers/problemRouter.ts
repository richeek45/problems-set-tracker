import { z } from "zod"; 
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { Difficulty, Status } from "@prisma/client";
import { TRPCError } from "@trpc/server";


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

const updateFormSchema = z.object({
  id: z.string(),
  title: z.string().min(5, {
    message: "Title must be 5 characters long"
  }),
  url: z.string().url({
    message: "Not a valid url"
  }).min(5, {
    message: "Url must be 10 characters long"
  }),
  status: z.enum([Status.TODO, Status.INPROGRESS, Status.COMPLETED, Status.REPEAT]),
  difficulty: z.enum([Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD]),
  tags: z.array(z.string()),
})

export const problemRouter = createTRPCRouter({

  getProblemById: publicProcedure
  .input(z.object({ id: z.string()}))
  .query(async ({ ctx, input }) => {
    const { id } = input;
    const problemById = await ctx.db.problem.findFirst({
      where: { id },
      // TODO - something is wrong here 
      include: {
        _count: true,
        status: { 
          where: { problemId: id },
          select:{ status: true }
        }
      }
    })

    console.log(problemById, "....ProblemById...")
    return problemById;
  }),

  resetProgressById: protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const { id } = input;

    return await ctx.db.problem.update({ where: { id }, data: { 
      attempts: {
        update: {
          where: {
            userId_problemId: {
              problemId: id,
              userId: ctx.session.user.id,
            }
          },
          data: {
            attempts: 0,
            updatedAt: new Date()
          }
        }
      },
      
      status: {
        update: {
          where: {
            userId_problemId: {
              problemId: id,
              userId: ctx.session.user.id,
            }
          },
          data: {
            status: Status.TODO,
            updatedAt: new Date()
          }
        }
      }
    }})
  }),

  getAllUserProblems: protectedProcedure.query(async ({ ctx }) => {
    // skip: Value, take: value
    // const { skip, take } = input;
    const userId = ctx.session.user.id;

    const problems = await ctx.db.problem.findMany({
      include: { 
        favouritedBy: {
          where: { id: userId }
        }, 
        attempts: {
          where: { userId },
          select: { attempts: true }
        },
        status: {
          where: { userId },
          select: { status: true }
        } 
      },
    });

    return problems;
  }),

  getAllProblems: publicProcedure.query(async ({ ctx }) => {
    const problems = await ctx.db.problem.findMany();
    return problems;
  }),

  createOneProblem: protectedProcedure
  .input(formSchema)
  .mutation(async ({ ctx, input }) => {
    const { title, url, difficulty, status, tags, attempts } = input;
    const userId = ctx.session.user.id;

    const problem = await ctx.db.problem.create({
      data: {
        title, 
        url, 
        tags, 
        difficulty,
        userId, 
        attempts: {
          create: [{
            attempts,
            userId
          }]
        },  
        status: {
          create: [{
            userId,
            status,
          }]
        },
    }});
    console.log(problem);
    return problem;
  }),

  createManyProblem: protectedProcedure
  .input(z.array(formSchema.extend({ problem_number: z.number() })))
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.session.user.id;
    const problemsData = input;

    const existingUrls = await ctx.db.problem.findMany({
      where: {
        OR: problemsData.map((problem) => ({
          url: problem.url,
        })),
      },
      select: {
        url: true,
      },
    });

    const existingUrlsSet = new Set(existingUrls.map((problem) => problem.url));
    const uniqueProblemsData = problemsData.filter((problem) => !existingUrlsSet.has(problem.url));

    const transactions = await ctx.db.$transaction(async (prisma) => {

      try {
        
        // Add the fields in the Problem table
        const problems = await prisma.problem.createMany({
          data: uniqueProblemsData.map((problem) => ({
            title: problem.title,
            url: problem.url,
            difficulty: problem.difficulty,
            tags: problem.tags,
            problem_number: problem.problem_number,
            userId
          })),
        })

        const createdProblems = await prisma.problem.findMany({
          where: {
            OR: uniqueProblemsData.map((problem) => ({
              title: problem.title,
              url: problem.url
            })),
          },
          select: { id: true }
        })

        const problemIds = createdProblems.map((problem) => problem.id);

        const createdUserStatusProblems = await prisma.userStatusProblems.createMany({
          data: problemIds.map((problemId, index) => ({
            problemId,
            userId,
            status: uniqueProblemsData[index].status
          }))
        })

        const createdUserAttemptsProblems = await prisma.userAttemptProblems.createMany({
          data: problemIds.map((problemId, index) => ({
            problemId,
            userId,
            attempts: uniqueProblemsData[index].attempts
          }))
        })

        console.log(`${problems} -> ${createdUserStatusProblems} ->  ${createdUserAttemptsProblems} records were created successfully!`);
        return problems;
      }
      catch(error) {
        return new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to bulk save problem data. Please try again!"})
      }
    }, {
      timeout: 10000 
    })
  }),

  deleteProblemById: protectedProcedure
  .input(z.object({ problemId: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // check if the user is deleting its own problem 
    const { problemId } = input;
    const userId = ctx.session.user.id;

    const transaction = await ctx.db.$transaction(async (prisma) => {
      try {

        const deletedProblem = await prisma.problem.delete({
          where: { id: problemId }
        })

        const favouritesDeleted = await prisma.user.update({
          where: { id: userId },
          data: {
            favourites: {
              disconnect: { id: problemId }
            }
          }
        })        

        console.log(deletedProblem, favouritesDeleted)
        return deletedProblem;

      } catch (error) {
        console.error('Error deleting problem and related data:', error);
        return new TRPCError({ code: "INTERNAL_SERVER_ERROR", "message": "Failed to delete Problem" });
      }
    })

  }),

  deleteMultipleProblems: protectedProcedure
  .input(z.object({ problemIds: z.array(z.string())}))
  .mutation(async ({ ctx, input }) => {
    const { problemIds } = input;
    
    try {
      await ctx.db.problem.deleteMany({
        where: {
          id: {
            in: problemIds
          }
        }
      })

      console.log("deleted all the problems and its related fields...")

    } catch (error) {
      return new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to delete selected problems!" })
    }

  }),

  updateProblemById: protectedProcedure
  .input(updateFormSchema)
  .mutation(async ({ ctx, input }) => {
    const { id, title, url, difficulty, status, tags } = input;
    const userId = ctx.session.user.id;
    const problem = await ctx.db.problem.update({
      where: { id },
      data: {
        title, url, tags, difficulty,
        status: {
          update: {
            where: {
              userId_problemId: {
                userId,
                problemId: id
              }
            },
            data: {
              status,
              updatedAt: new Date()  
            }
          }
        }
      }});
    console.log(problem);
    return problem;

  }),

  toggleProblemFavourite: protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const { id: problemId } = input;
    const userId = ctx.session.user.id;

    const problem = await ctx.db.problem.findUnique({
      where: { id: problemId},
    });

    // If problem does not exist propagate the error to the client side
    if (!problem) {
      return new TRPCError({ code: "NOT_FOUND", message: `problem with the id = ${problemId} not found!` })
    }

    // Find the user by userId along with their favourites
    const userData = await ctx.db.user.findUnique({
      where: { id: userId },
      include: { favourites: true }
    });

    const isFavourited = userData?.favourites.some((favProblem) => favProblem.id === problemId);

    if (isFavourited) {
      // if the problem is already favourite, then remove it from the favourites
      const updatedProblem = await ctx.db.user.update({
        where: { id: userId },
        data: {
          favourites: { 
            disconnect: { id: problemId }
          }
        }
      })

      console.log('Problem updated successfully:', updatedProblem);
      return updatedProblem;
    } 

    // if the problem is not a favourite, add it to the favourite 
    const updatedProblem = await ctx.db.user.update({
      where: { id: userId },
      data: {
        favourites: {
          connect: { id: problemId }
        }
      }
    })

    console.log('Problem updated successfully:', updatedProblem);
    return updatedProblem;
  }),

  markCompleted: protectedProcedure
  .input(z.object({ 
    id: z.string(), 
    attempts: z.number(), 
    status: z.enum([Status.TODO, Status.INPROGRESS, Status.COMPLETED, Status.REPEAT]) 
  }))
  .mutation(async ({ ctx, input }) => {
    const { id: problemId, attempts, status } = input;
    const userId = ctx.session.user.id;

    return ctx.db.problem.update({
      where: { id: problemId },
      data: {
        attempts: {
          update: {
            where: { 
              userId_problemId: {
                userId,
                problemId
              }
            },
            data: {
              attempts: attempts + 1,
              updatedAt: new Date()
            }
          }
        },

        status: {
          update: {
            where: {
              userId_problemId: {
                userId,
                problemId
              },
            },
            data: {
              status: Status.COMPLETED,
              updatedAt: new Date()
            }
          }
        }
      }
    })
  })

})