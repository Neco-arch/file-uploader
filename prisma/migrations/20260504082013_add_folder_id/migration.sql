/*
  Warnings:

  - You are about to drop the column `path` on the `Folder` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Filedata_filename_key";

-- DropIndex
DROP INDEX "Folder_foldername_key";

-- DropIndex
DROP INDEX "Folder_path_key";

-- AlterTable
ALTER TABLE "Folder" DROP COLUMN "path",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Folder_pkey" PRIMARY KEY ("id");
