/*
  Warnings:

  - You are about to drop the column `attempts` on the `problems` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `problems` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "problems" DROP COLUMN "attempts",
DROP COLUMN "status";

-- CreateTable
CREATE TABLE "_UserStatusProblems" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_UserAttemptProblems" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserStatusProblems_AB_unique" ON "_UserStatusProblems"("A", "B");

-- CreateIndex
CREATE INDEX "_UserStatusProblems_B_index" ON "_UserStatusProblems"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserAttemptProblems_AB_unique" ON "_UserAttemptProblems"("A", "B");

-- CreateIndex
CREATE INDEX "_UserAttemptProblems_B_index" ON "_UserAttemptProblems"("B");

-- AddForeignKey
ALTER TABLE "_UserStatusProblems" ADD CONSTRAINT "_UserStatusProblems_A_fkey" FOREIGN KEY ("A") REFERENCES "problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserStatusProblems" ADD CONSTRAINT "_UserStatusProblems_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserAttemptProblems" ADD CONSTRAINT "_UserAttemptProblems_A_fkey" FOREIGN KEY ("A") REFERENCES "problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserAttemptProblems" ADD CONSTRAINT "_UserAttemptProblems_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
