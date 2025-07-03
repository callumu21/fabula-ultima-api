import {
  type Class,
  type Skill,
  type Spell,
  type Weapon,
  type User,
  type StatusEffect,
  type Character,
  type Armour,
  type Shield,
} from '../../typings/index';

type MockFactory<T> = (overrides?: Partial<T>) => T;

export const createMockClass: MockFactory<Class> = (overrides = {}) => {
  return {
    id: 'test-class-id',
    name: 'Test Class',
    description: 'Test description',
    questions: ['Question 1', 'Question 2'],
    benefits: [
      {
        type: 'AUTOMATIC',
        description: 'Permanently increase your maximum Mind Points by 5.',
        bonus: { stat: 'MP', increase: 5 },
      },
    ],
    ...overrides,
  };
};

export const createMockSkill: MockFactory<Skill> = (overrides = {}) => {
  return {
    id: 'test-skill',
    name: 'Test Skill',
    description: 'A test skill',
    maxRank: 1,
    classId: createMockClass().id,
    ...overrides,
  };
};

export const createMockSpell: MockFactory<Spell> = (overrides = {}) => {
  return {
    id: 'mock-spell',
    name: 'Mock Spell',
    description: 'A mock spell',
    isOffensive: false,
    mpCost: '10',
    target: '3 creatures',
    duration: 'instantaneous',
    classId: createMockClass().id,
    ...overrides,
  };
};

export const createMockWeapon: MockFactory<Weapon> = (overrides = {}) => {
  return {
    id: 'mock-weapon',
    name: 'Mock Weapon',
    category: 'flail',
    isBasic: true,
    isMartial: false,
    cost: 100,
    handsRequired: 1,
    range: 'melee',
    accuracy: '[MIG + DEX]',
    damage: '[HR + 6]',
    damageType: 'physical',
    quality: null,
    ...overrides,
  };
};

export const createMockUser: MockFactory<User> = (overrides = {}) => {
  return {
    email: 'test@user.com',
    password: 'password',
    ...overrides,
  };
};

export const createMockStatusEffect: MockFactory<StatusEffect & { id: string }> = (
  overrides = {}
) => {
  return {
    id: 'mock-status-effect',
    name: 'Slow',
    affectedAttributes: ['INS'],
    ...overrides,
  };
};

export const createMockArmour: MockFactory<Armour> = (overrides = {}) => {
  return {
    id: 'mock-armour',
    name: 'Mock Armour',
    cost: 100,
    isBasic: true,
    quality: null,
    isMartial: false,
    usesDex: true,
    usesIns: true,
    dexBonus: 0,
    insBonus: 0,
    initiativeBonus: 0,
    ...overrides,
  };
};

export const createMockShield: MockFactory<Shield> = (overrides = {}) => {
  return {
    id: 'mock-shield',
    name: 'Mock Shueld',
    cost: 100,
    isBasic: true,
    quality: null,
    isMartial: false,
    defenseBonus: 0,
    magicDefenseBonus: 0,
    initiativeBonus: 0,
    ...overrides,
  };
};

export const createMockCharacter: MockFactory<Character> = (overrides = {}) => {
  return {
    id: 'mock-character',
    name: 'Mock Character',
    identity: 'Mock identity',
    theme: 'Mock theme',
    origin: 'Mock origin',
    pronouns: 'They/them',
    bonds: [],
    attributes: {
      dexterity: {
        base: 'd8',
        current: 'd8',
      },
      insight: {
        base: 'd8',
        current: 'd8',
      },
      might: {
        base: 'd8',
        current: 'd8',
      },
      willpower: {
        base: 'd8',
        current: 'd8',
      },
    },
    hitPoints: {
      max: 50,
      current: 50,
    },
    mindPoints: {
      max: 30,
      current: 30,
    },
    inventoryPoints: {
      max: 6,
      current: 6,
    },
    statusEffects: [],
    classes: [],
    skills: [],
    spells: [],
    equipment: {
      slots: {
        mainHand: null,
        offHand: null,
        armour: null,
        accessory: null,
      },
      backpack: [],
    },
    zenit: 100,
    initiativeModifier: 0,
    defense: 8,
    magicDefense: 8,
    ...overrides,
  };
};
