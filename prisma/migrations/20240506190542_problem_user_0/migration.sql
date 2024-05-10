-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "createdById" TEXT NOT NULL DEFAULT 'clvpe54g60002951umhl8x09a';

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
