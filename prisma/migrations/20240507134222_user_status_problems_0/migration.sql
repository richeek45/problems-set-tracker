/*
  Warnings:

  - You are about to drop the `_UserStatusProblems` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserStatusProblems" DROP CONSTRAINT "_UserStatusProblems_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserStatusProblems" DROP CONSTRAINT "_UserStatusProblems_B_fkey";

-- DropTable
DROP TABLE "_UserStatusProblems";

-- CreateTable
CREATE TABLE "UserStatusProblems" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "UserStatusProblems_userId_problemId_key" ON "UserStatusProblems"("userId", "problemId");

-- AddForeignKey
ALTER TABLE "UserStatusProblems" ADD CONSTRAINT "UserStatusProblems_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStatusProblems" ADD CONSTRAINT "UserStatusProblems_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
