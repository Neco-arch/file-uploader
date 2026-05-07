/*
  Warnings:

  - You are about to drop the column `path` on the `Filedata` table. All the data in the column will be lost.
  - Added the required column `url` to the `Filedata` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Filedata" DROP COLUMN "path",
ADD COLUMN     "url" TEXT NOT NULL;
