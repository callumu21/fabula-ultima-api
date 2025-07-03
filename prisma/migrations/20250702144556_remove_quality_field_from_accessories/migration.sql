/*
  Warnings:

  - You are about to drop the column `quality` on the `Accessory` table. All the data in the column will be lost.
  - Made the column `description` on table `Accessory` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Accessory" DROP COLUMN "quality",
ALTER COLUMN "description" SET NOT NULL;
