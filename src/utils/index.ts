import { type StatusEffect, type Bond } from '../../generated/prisma';
import { CharacterWithRelations } from '../models/characters';
import {
  type Character as TypedCharacter,
  type Bond as TypedBond,
  type DieSize,
  type StatusEffect as TypedStatusEffect,
  type StatusEffectName,
  type EquipmentSlots,
} from '../typings';

export const createIdFromName = (name: string) => {
  return name.toLowerCase().split(' ').join('-');
};

export const formatBond = (bond: Bond): TypedBond => {
  return {
    name: bond.name,
    emotions: bond.emotions,
  };
};

export const formatStatusEffect = (statusEffect: StatusEffect): TypedStatusEffect => {
  return {
    name: statusEffect.name as StatusEffectName,
    affectedAttributes: statusEffect.affectedAttributes,
  };
};

export const calculateDefenseStats = (
  equipment: EquipmentSlots,
  baseDefenses: { defense: number; magicDefense: number }
) => {
  const { armour, mainHand, offHand } = equipment;

  let initiativeModifier = 0;
  let defense = baseDefenses.defense;
  let magicDefense = baseDefenses.magicDefense;

  if (armour) {
    const { initiativeBonus, usesDex, dexBonus, usesIns, insBonus } = armour;
    initiativeModifier += initiativeBonus;

    if (usesDex) {
      defense += dexBonus;
    } else {
      defense = dexBonus;
    }

    if (usesIns) {
      magicDefense += insBonus;
    } else {
      magicDefense = insBonus;
    }
  }

  if (mainHand && 'initiativeBonus' in mainHand) {
    const { initiativeBonus, defenseBonus, magicDefenseBonus } = mainHand;

    initiativeModifier += initiativeBonus;
    defense += defenseBonus;
    magicDefense += magicDefenseBonus;
  }

  if (offHand && 'initiativeBonus' in offHand) {
    const { initiativeBonus, defenseBonus, magicDefenseBonus } = offHand;

    initiativeModifier += initiativeBonus;
    defense += defenseBonus;
    magicDefense += magicDefenseBonus;
  }

  return { initiativeModifier, defense, magicDefense };
};

export const formatCharacter = (
  character: CharacterWithRelations,
  equipment: EquipmentSlots
): TypedCharacter => {
  const dieStats = {
    d6: 6,
    d8: 8,
    d10: 10,
    d12: 12,
  };
  const { initiativeModifier, defense, magicDefense } = calculateDefenseStats(equipment, {
    defense: dieStats[character.dexCurrent as DieSize],
    magicDefense: dieStats[character.insCurrent as DieSize],
  });

  return {
    id: character.id,
    name: character.name,
    identity: character.identity,
    theme: character.theme,
    origin: character.origin,
    pronouns: character.pronouns,
    attributes: {
      dexterity: {
        current: character.dexCurrent as DieSize,
        base: character.dexBase as DieSize,
      },
      insight: {
        current: character.insCurrent as DieSize,
        base: character.insBase as DieSize,
      },
      might: {
        current: character.migCurrent as DieSize,
        base: character.migBase as DieSize,
      },
      willpower: {
        current: character.wlpCurrent as DieSize,
        base: character.wlpBase as DieSize,
      },
    },
    hitPoints: {
      max: character.hpMax,
      current: character.hpCurrent,
    },
    mindPoints: {
      max: character.mpMax,
      current: character.mpCurrent,
    },
    inventoryPoints: {
      max: character.ipMax,
      current: character.ipCurrent,
    },
    equipment: {
      slots: {
        mainHand: equipment.mainHand,
        offHand: equipment.offHand,
        armour: equipment.armour,
        accessory: equipment.accessory,
      },
      backpack: [],
    },
    initiativeModifier,
    defense,
    magicDefense,
    zenit: character.zenit,
    classes: character.classLevels.map(({ class: characterClass, level }) => ({
      name: characterClass.name,
      level,
    })),
    spells: character.spells.map(({ spell }) => spell),
    skills: character.skills.map(({ rank, skill }) => ({ ...skill, rank })),
    bonds: character.bonds.map((bond) => formatBond(bond)),
    statusEffects: character.statusEffects.map(({ statusEffect }) =>
      formatStatusEffect(statusEffect)
    ),
  };
};
