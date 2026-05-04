-- AlterTable
ALTER TABLE "Filedata" ADD COLUMN     "path" TEXT;

-- CreateTable
CREATE TABLE "Folder" (
    "foldername" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "path" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Folder_foldername_key" ON "Folder"("foldername");

-- CreateIndex
CREATE UNIQUE INDEX "Folder_path_key" ON "Folder"("path");

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "userdata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
