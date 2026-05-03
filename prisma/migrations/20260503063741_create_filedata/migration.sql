-- CreateTable
CREATE TABLE "Filedata" (
    "fileid" INTEGER NOT NULL,
    "filename" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Filedata_filename_key" ON "Filedata"("filename");

-- AddForeignKey
ALTER TABLE "Filedata" ADD CONSTRAINT "Filedata_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "userdata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
