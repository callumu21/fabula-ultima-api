-- CreateEnum
CREATE TYPE "BondEmotion" AS ENUM ('admiration', 'loyalty', 'affection', 'inferiority', 'mistrust', 'hatred');

-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('weapon', 'shield');

-- CreateTable
CREATE TABLE "Bond" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "emotions" "BondEmotion"[],
    "characterId" TEXT NOT NULL,

    CONSTRAINT "Bond_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Accessory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cost" INTEGER NOT NULL,
    "description" TEXT,
    "quality" TEXT,

    CONSTRAINT "Accessory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassLevel" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "characterId" TEXT NOT NULL,

    CONSTRAINT "ClassLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterSkill" (
    "id" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,

    CONSTRAINT "CharacterSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterSpell" (
    "id" TEXT NOT NULL,
    "spellId" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,

    CONSTRAINT "CharacterSpell_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterStatusEffect" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "statusEffectId" TEXT NOT NULL,

    CONSTRAINT "CharacterStatusEffect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "identity" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "pronouns" TEXT NOT NULL,
    "profilePicture" TEXT,
    "dexBase" TEXT NOT NULL,
    "dexCurrent" TEXT NOT NULL,
    "insBase" TEXT NOT NULL,
    "insCurrent" TEXT NOT NULL,
    "migBase" TEXT NOT NULL,
    "migCurrent" TEXT NOT NULL,
    "wlpBase" TEXT NOT NULL,
    "wlpCurrent" TEXT NOT NULL,
    "hpMax" INTEGER NOT NULL,
    "hpCurrent" INTEGER NOT NULL,
    "mpMax" INTEGER NOT NULL,
    "mpCurrent" INTEGER NOT NULL,
    "ipMax" INTEGER NOT NULL,
    "ipCurrent" INTEGER NOT NULL,
    "zenit" INTEGER NOT NULL DEFAULT 0,
    "mainHandId" TEXT,
    "mainHandType" "ItemType",
    "offHandId" TEXT,
    "offHandType" "ItemType",
    "armourId" TEXT,
    "accessoryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bond" ADD CONSTRAINT "Bond_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassLevel" ADD CONSTRAINT "ClassLevel_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassLevel" ADD CONSTRAINT "ClassLevel_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterSkill" ADD CONSTRAINT "CharacterSkill_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterSkill" ADD CONSTRAINT "CharacterSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterSpell" ADD CONSTRAINT "CharacterSpell_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterSpell" ADD CONSTRAINT "CharacterSpell_spellId_fkey" FOREIGN KEY ("spellId") REFERENCES "Spell"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterStatusEffect" ADD CONSTRAINT "CharacterStatusEffect_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterStatusEffect" ADD CONSTRAINT "CharacterStatusEffect_statusEffectId_fkey" FOREIGN KEY ("statusEffectId") REFERENCES "StatusEffect"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_armourId_fkey" FOREIGN KEY ("armourId") REFERENCES "Armour"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_accessoryId_fkey" FOREIGN KEY ("accessoryId") REFERENCES "Accessory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
