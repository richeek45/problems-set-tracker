-- DropForeignKey
ALTER TABLE "UserAttemptProblems" DROP CONSTRAINT "UserAttemptProblems_problemId_fkey";

-- DropForeignKey
ALTER TABLE "UserStatusProblems" DROP CONSTRAINT "UserStatusProblems_problemId_fkey";

-- AddForeignKey
ALTER TABLE "UserAttemptProblems" ADD CONSTRAINT "UserAttemptProblems_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStatusProblems" ADD CONSTRAINT "UserStatusProblems_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
