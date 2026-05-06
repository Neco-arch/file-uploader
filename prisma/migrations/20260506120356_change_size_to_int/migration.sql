/*
  Warnings:

  - Changed the type of `size` on the `Filedata` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Filedata" DROP COLUMN "size",
ADD COLUMN     "size" INTEGER NOT NULL;
