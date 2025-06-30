-- CreateEnum
CREATE TYPE "Attribute" AS ENUM ('DEX', 'INS', 'MIG', 'WLP');

-- CreateTable
CREATE TABLE "StatusEffect" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "affectedAttributes" "Attribute"[],

    CONSTRAINT "StatusEffect_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StatusEffect_name_key" ON "StatusEffect"("name");
