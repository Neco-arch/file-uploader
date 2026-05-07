/*
  Warnings:

  - Added the required column `path` to the `Filedata` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Filedata" ADD COLUMN     "path" TEXT NOT NULL;
