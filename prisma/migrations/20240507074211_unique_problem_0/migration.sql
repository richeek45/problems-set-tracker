/*
  Warnings:

  - You are about to drop the `problems` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserAttemptProblems" DROP CONSTRAINT "_UserAttemptProblems_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserFavouriteProblems" DROP CONSTRAINT "_UserFavouriteProblems_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserStatusProblems" DROP CONSTRAINT "_UserStatusProblems_A_fkey";

-- DropForeignKey
ALTER TABLE "problems" DROP CONSTRAINT "problems_userId_fkey";

-- DropTable
DROP TABLE "problems";

-- CreateTable
CREATE TABLE "Problem" (
    "id" TEXT NOT NULL,
    "problem_number" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "tags" TEXT[],
    "difficulty" "Difficulty" NOT NULL DEFAULT 'EASY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Problem_title_key" ON "Problem"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Problem_url_key" ON "Problem"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Problem_title_url_key" ON "Problem"("title", "url");

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFavouriteProblems" ADD CONSTRAINT "_UserFavouriteProblems_A_fkey" FOREIGN KEY ("A") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserStatusProblems" ADD CONSTRAINT "_UserStatusProblems_A_fkey" FOREIGN KEY ("A") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserAttemptProblems" ADD CONSTRAINT "_UserAttemptProblems_A_fkey" FOREIGN KEY ("A") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
