/*
  Warnings:

  - You are about to drop the `_UserAttemptProblems` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserAttemptProblems" DROP CONSTRAINT "_UserAttemptProblems_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserAttemptProblems" DROP CONSTRAINT "_UserAttemptProblems_B_fkey";

-- DropTable
DROP TABLE "_UserAttemptProblems";

-- CreateTable
CREATE TABLE "UserAttemptProblems" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "UserAttemptProblems_userId_problemId_key" ON "UserAttemptProblems"("userId", "problemId");

-- AddForeignKey
ALTER TABLE "UserAttemptProblems" ADD CONSTRAINT "UserAttemptProblems_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAttemptProblems" ADD CONSTRAINT "UserAttemptProblems_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
