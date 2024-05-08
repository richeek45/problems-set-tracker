/*
  Warnings:

  - A unique constraint covering the columns `[title,url,tags]` on the table `Problem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Problem_title_key";

-- DropIndex
DROP INDEX "Problem_title_url_key";

-- CreateIndex
CREATE UNIQUE INDEX "Problem_title_url_tags_key" ON "Problem"("title", "url", "tags");
