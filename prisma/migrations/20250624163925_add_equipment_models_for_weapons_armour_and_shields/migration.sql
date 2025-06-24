/*
  Warnings:

  - The values [SCENE,INSTANTANEOUS] on the enum `SpellDuration` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "WeaponCategory" AS ENUM ('brawling', 'dagger', 'firearm', 'flail', 'heavy', 'spear', 'sword', 'thrown');

-- CreateEnum
CREATE TYPE "Range" AS ENUM ('melee', 'ranged');

-- CreateEnum
CREATE TYPE "DamageType" AS ENUM ('physical', 'magical');

-- AlterEnum
BEGIN;
CREATE TYPE "SpellDuration_new" AS ENUM ('scene', 'instantaneous');
ALTER TABLE "Spell" ALTER COLUMN "duration" TYPE "SpellDuration_new" USING ("duration"::text::"SpellDuration_new");
ALTER TYPE "SpellDuration" RENAME TO "SpellDuration_old";
ALTER TYPE "SpellDuration_new" RENAME TO "SpellDuration";
DROP TYPE "SpellDuration_old";
COMMIT;

-- CreateTable
CREATE TABLE "Weapon" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "WeaponCategory" NOT NULL,
    "isBasic" BOOLEAN NOT NULL,
    "isMartial" BOOLEAN NOT NULL,
    "cost" INTEGER NOT NULL,
    "handsRequired" INTEGER NOT NULL,
    "range" "Range" NOT NULL,
    "accuracy" TEXT NOT NULL,
    "damage" TEXT NOT NULL,
    "damageType" "DamageType" NOT NULL,
    "quality" TEXT,

    CONSTRAINT "Weapon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Armour" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cost" INTEGER NOT NULL,
    "isBasic" BOOLEAN NOT NULL,
    "isMartial" BOOLEAN NOT NULL,
    "usesDex" BOOLEAN NOT NULL,
    "dexBonus" INTEGER NOT NULL,
    "usesIns" BOOLEAN NOT NULL,
    "insBonus" INTEGER NOT NULL,
    "initiativeBonus" INTEGER NOT NULL,
    "quality" TEXT,

    CONSTRAINT "Armour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shield" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cost" INTEGER NOT NULL,
    "isBasic" BOOLEAN NOT NULL,
    "isMartial" BOOLEAN NOT NULL,
    "defenseBonus" INTEGER NOT NULL,
    "magicDefenseBonus" INTEGER NOT NULL,
    "initiativeBonus" INTEGER NOT NULL,
    "quality" TEXT,

    CONSTRAINT "Shield_pkey" PRIMARY KEY ("id")
);
