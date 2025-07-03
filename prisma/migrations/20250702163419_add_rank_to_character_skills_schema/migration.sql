/*
  Warnings:

  - Added the required column `rank` to the `CharacterSkill` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CharacterSkill" ADD COLUMN     "rank" INTEGER NOT NULL;
