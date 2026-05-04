-- AlterTable
CREATE SEQUENCE filedata_fileid_seq;
ALTER TABLE "Filedata" ALTER COLUMN "fileid" SET DEFAULT nextval('filedata_fileid_seq'),
ADD CONSTRAINT "Filedata_pkey" PRIMARY KEY ("fileid");
ALTER SEQUENCE filedata_fileid_seq OWNED BY "Filedata"."fileid";
