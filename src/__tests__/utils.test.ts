import { Bond, StatusEffect } from '../../generated/prisma';
import { EquipmentSlots } from '../typings';
import {
  createIdFromName,
  formatBond,
  formatStatusEffect,
  calculateDefenseStats,
} from '../utils/index';
import { createMockArmour, createMockShield } from './fixtures/mockData';

describe('createIdFromName', () => {
  it('Produces a correct ID when given a single lowercase word', () => {
    const name = 'provoke';

    expect(createIdFromName(name)).toBe('provoke');
  });

  it('Produces a correct ID when given a single lowercase word beginning with a capital letter', () => {
    const name = 'Provoke';

    expect(createIdFromName(name)).toBe('provoke');
  });

  it('Produces a correct ID when given multiple lowercase words', () => {
    const name = 'provoke enemies';

    expect(createIdFromName(name)).toBe('provoke-enemies');
  });

  it('Produces a correct ID when given multiple lowercase words beginning with a capital letter', () => {
    const name = 'Provoke Enemies';

    expect(createIdFromName(name)).toBe('provoke-enemies');
  });
});

describe('formatBond', () => {
  it('Returns a bond with correct name value', () => {
    const bondFromDatabase: Bond = {
      id: '1',
      name: 'Test Ally',
      emotions: ['admiration'],
      characterId: '1',
    };

    const formattedBond = formatBond(bondFromDatabase);

    expect(formattedBond).toHaveProperty('name');
    expect(formattedBond.name).toBe(bondFromDatabase.name);
  });

  it('Returns a bond with correct emotions value for single emotion', () => {
    const bondFromDatabase: Bond = {
      id: '1',
      name: 'Test Ally',
      emotions: ['admiration'],
      characterId: '1',
    };

    const formattedBond = formatBond(bondFromDatabase);

    expect(formattedBond).toHaveProperty('emotions');
    expect(Array.isArray(formattedBond.emotions)).toBe(true);
    expect(formattedBond.emotions).toEqual(bondFromDatabase.emotions);
  });

  it('Returns a bond with correct emotions value for multiple emotions', () => {
    const bondFromDatabase: Bond = {
      id: '1',
      name: 'Test Ally',
      emotions: ['admiration', 'loyalty'],
      characterId: '1',
    };

    const formattedBond = formatBond(bondFromDatabase);

    expect(formattedBond).toHaveProperty('emotions');
    expect(Array.isArray(formattedBond.emotions)).toBe(true);
    expect(formattedBond.emotions).toEqual(bondFromDatabase.emotions);
  });
});

describe('formatStatusEffect', () => {
  it('Returns a status effect with correct name value', () => {
    const statusEffectFromDatabase: StatusEffect = {
      id: '1',
      name: 'weak',
      affectedAttributes: ['MIG'],
    };

    const formattedStatusEffect = formatStatusEffect(statusEffectFromDatabase);

    expect(formattedStatusEffect).toHaveProperty('name');
    expect(formattedStatusEffect.name).toBe(statusEffectFromDatabase.name);
  });

  it('Returns a bond with correct affectedAttributes value for single attribute', () => {
    const statusEffectFromDatabase: StatusEffect = {
      id: '1',
      name: 'weak',
      affectedAttributes: ['MIG'],
    };

    const formattedStatusEffect = formatStatusEffect(statusEffectFromDatabase);

    expect(formattedStatusEffect).toHaveProperty('affectedAttributes');
    expect(formattedStatusEffect.affectedAttributes).toEqual(
      statusEffectFromDatabase.affectedAttributes
    );
  });

  it('Returns a bond with correct affectedAttributes value for multiple attributes', () => {
    const statusEffectFromDatabase: StatusEffect = {
      id: '1',
      name: 'poisoned',
      affectedAttributes: ['MIG', 'WLP'],
    };

    const formattedStatusEffect = formatStatusEffect(statusEffectFromDatabase);

    expect(formattedStatusEffect).toHaveProperty('affectedAttributes');
    expect(formattedStatusEffect.affectedAttributes).toEqual(
      statusEffectFromDatabase.affectedAttributes
    );
  });
});

describe('calculateDefenseStats', () => {
  it('correctly calculates initiative modifier when wearing no equipment', () => {
    const equipment: EquipmentSlots = {
      mainHand: null,
      offHand: null,
      armour: null,
      accessory: null,
    };

    const baseDefenses = {
      defense: 8,
      magicDefense: 8,
    };

    const { initiativeModifier } = calculateDefenseStats(equipment, baseDefenses);

    expect(initiativeModifier).toBe(0);
  });

  it('correctly calculates defense when wearing no equipment', () => {
    const equipment: EquipmentSlots = {
      mainHand: null,
      offHand: null,
      armour: null,
      accessory: null,
    };

    const baseDefenses = {
      defense: 8,
      magicDefense: 8,
    };

    const { defense } = calculateDefenseStats(equipment, baseDefenses);

    expect(defense).toBe(baseDefenses.defense);
  });

  it('correctly calculates magic defense when wearing no equipment', () => {
    const equipment: EquipmentSlots = {
      mainHand: null,
      offHand: null,
      armour: null,
      accessory: null,
    };

    const baseDefenses = {
      defense: 8,
      magicDefense: 8,
    };

    const { magicDefense } = calculateDefenseStats(equipment, baseDefenses);

    expect(magicDefense).toBe(baseDefenses.magicDefense);
  });

  it('correctly calculates initiative when wearing just armour', () => {
    const equipment: EquipmentSlots = {
      mainHand: null,
      offHand: null,
      armour: createMockArmour({ initiativeBonus: -2 }),
      accessory: null,
    };

    const baseDefenses = {
      defense: 8,
      magicDefense: 8,
    };

    const { initiativeModifier } = calculateDefenseStats(equipment, baseDefenses);

    expect(initiativeModifier).toBe(-2);
  });

  it('correctly calculates initiative when wearing just a shield', () => {
    const equipment: EquipmentSlots = {
      mainHand: null,
      offHand: createMockShield({ initiativeBonus: -1 }),
      armour: null,
      accessory: null,
    };

    const baseDefenses = {
      defense: 8,
      magicDefense: 8,
    };

    const { initiativeModifier } = calculateDefenseStats(equipment, baseDefenses);

    expect(initiativeModifier).toBe(-1);
  });

  it('correctly calculates initiative when dual wielding shields', () => {
    const equipment: EquipmentSlots = {
      mainHand: createMockShield({ initiativeBonus: -3 }),
      offHand: createMockShield({ initiativeBonus: -1 }),
      armour: null,
      accessory: null,
    };

    const baseDefenses = {
      defense: 8,
      magicDefense: 8,
    };

    const { initiativeModifier } = calculateDefenseStats(equipment, baseDefenses);

    expect(initiativeModifier).toBe(-4);
  });

  it('correctly calculates initiative when dual wielding shields with armour', () => {
    const equipment: EquipmentSlots = {
      mainHand: createMockShield({ initiativeBonus: -3 }),
      offHand: createMockShield({ initiativeBonus: -1 }),
      armour: createMockArmour({ initiativeBonus: -1 }),
      accessory: null,
    };

    const baseDefenses = {
      defense: 8,
      magicDefense: 8,
    };

    const { initiativeModifier } = calculateDefenseStats(equipment, baseDefenses);

    expect(initiativeModifier).toBe(-5);
  });

  it('correctly calculates defense when only armour is equipped and armour uses base DEX', () => {
    const equipment: EquipmentSlots = {
      mainHand: null,
      offHand: null,
      armour: createMockArmour({ usesDex: true, dexBonus: 1 }),
      accessory: null,
    };

    const baseDefenses = {
      defense: 8,
      magicDefense: 8,
    };

    const { defense } = calculateDefenseStats(equipment, baseDefenses);

    expect(defense).toBe(9);
  });

  it('correctly calculates defense when only armour is equipped and armour does not use base DEX', () => {
    const equipment: EquipmentSlots = {
      mainHand: null,
      offHand: null,
      armour: createMockArmour({ usesDex: false, dexBonus: 13 }),
      accessory: null,
    };

    const baseDefenses = {
      defense: 8,
      magicDefense: 8,
    };

    const { defense } = calculateDefenseStats(equipment, baseDefenses);

    expect(defense).toBe(13);
  });

  it('correctly calculates magic defense when only armour is equipped and armour uses base INS', () => {
    const equipment: EquipmentSlots = {
      mainHand: null,
      offHand: null,
      armour: createMockArmour({ usesIns: true, insBonus: 3 }),
      accessory: null,
    };

    const baseDefenses = {
      defense: 8,
      magicDefense: 8,
    };

    const { magicDefense } = calculateDefenseStats(equipment, baseDefenses);

    expect(magicDefense).toBe(11);
  });

  it('correctly calculates magic defense when only armour is equipped and armour does not use base INS', () => {
    const equipment: EquipmentSlots = {
      mainHand: null,
      offHand: null,
      armour: createMockArmour({ usesIns: false, insBonus: 12 }),
      accessory: null,
    };

    const baseDefenses = {
      defense: 8,
      magicDefense: 8,
    };

    const { magicDefense } = calculateDefenseStats(equipment, baseDefenses);

    expect(magicDefense).toBe(12);
  });

  it('correctly calculates defense when armour and shield are equipped', () => {
    const equipment: EquipmentSlots = {
      mainHand: null,
      offHand: createMockShield({ defenseBonus: 1 }),
      armour: createMockArmour({ usesDex: true, dexBonus: 2 }),
      accessory: null,
    };

    const baseDefenses = {
      defense: 8,
      magicDefense: 8,
    };

    const { defense } = calculateDefenseStats(equipment, baseDefenses);

    expect(defense).toBe(11);
  });

  it('correctly calculates magic defense when armour and shield are equipped', () => {
    const equipment: EquipmentSlots = {
      mainHand: null,
      offHand: createMockShield({ magicDefenseBonus: 3 }),
      armour: createMockArmour({ usesIns: true, insBonus: 1 }),
      accessory: null,
    };

    const baseDefenses = {
      defense: 8,
      magicDefense: 8,
    };

    const { magicDefense } = calculateDefenseStats(equipment, baseDefenses);

    expect(magicDefense).toBe(12);
  });
});
