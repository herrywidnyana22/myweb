-- Migration: Convert name fields from String to Json (MultiLangText)
-- This preserves existing data by wrapping strings in {source: "value"} format

-- 1. ProfileItem.name: String -> Json
ALTER TABLE "ProfileItem" ADD COLUMN "name_new" JSONB;
UPDATE "ProfileItem" SET "name_new" = jsonb_build_object('source', "name");
ALTER TABLE "ProfileItem" DROP COLUMN "name";
ALTER TABLE "ProfileItem" RENAME COLUMN "name_new" TO "name";
ALTER TABLE "ProfileItem" ALTER COLUMN "name" SET NOT NULL;

-- 2. Project.name: String -> Json  
ALTER TABLE "Project" ADD COLUMN "name_new" JSONB;
UPDATE "Project" SET "name_new" = jsonb_build_object('source', "name");
ALTER TABLE "Project" DROP COLUMN "name";
ALTER TABLE "Project" RENAME COLUMN "name_new" TO "name";
ALTER TABLE "Project" ALTER COLUMN "name" SET NOT NULL;
