/*
  Warnings:

  - Added the required column `benefits` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Class` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "benefits" JSONB NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "questions" TEXT[];
