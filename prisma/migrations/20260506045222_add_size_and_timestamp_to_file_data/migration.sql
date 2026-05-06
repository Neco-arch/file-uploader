/*
  Warnings:

  - Added the required column `size` to the `Filedata` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `Filedata` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Filedata" ADD COLUMN     "size" BYTEA NOT NULL,
ADD COLUMN     "time" TIMESTAMP(3) NOT NULL;
