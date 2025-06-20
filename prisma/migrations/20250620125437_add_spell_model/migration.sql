-- CreateEnum
CREATE TYPE "SpellDuration" AS ENUM ('SCENE', 'INSTANTANEOUS');

-- CreateTable
CREATE TABLE "Spell" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isOffensive" BOOLEAN NOT NULL,
    "mpCost" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "duration" "SpellDuration" NOT NULL,
    "classId" TEXT NOT NULL,

    CONSTRAINT "Spell_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Spell" ADD CONSTRAINT "Spell_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
