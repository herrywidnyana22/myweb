/*
  Warnings:

  - The `description` column on the `Experience` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Experience" DROP COLUMN "description",
ADD COLUMN     "description" JSONB;
