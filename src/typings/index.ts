type BonusStat = 'MP' | 'HP' | 'IP';

type Bonus =
  | {
      stat: BonusStat;
      increase: number;
    }
  | {
      proficiency:
        | 'Ritualism'
        | 'Projects'
        | 'martial melee weapons'
        | 'martial ranged weapons'
        | 'martial shields'
        | 'martial armour';
    };

type ClassBenefit = {
  type: 'AUTOMATIC';
  description: string;
  bonus: Bonus;
};

export interface Class {
  id: string;
  name: string;
  description: string;
  questions: string[];
  benefits: ClassBenefit[];
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  maxRank: number;
  classId: string;
}

type SpellDuration = 'scene' | 'instantaneous';

export interface Spell {
  id: string;
  name: string;
  description: string;
  isOffensive: boolean;
  mpCost: string;
  target: string;
  duration: SpellDuration;
  classId: string;
}

interface EquipmentBase {
  id: string;
  name: string;
  cost: number;
  isBasic: boolean;
  quality: null | string;
}

type WeaponType =
  | 'arcane'
  | 'bow'
  | 'brawling'
  | 'dagger'
  | 'firearm'
  | 'flail'
  | 'heavy'
  | 'spear'
  | 'sword'
  | 'thrown';

export type Weapon = EquipmentBase & {
  category: WeaponType;
  isMartial: boolean;
  handsRequired: 1 | 2;
  range: 'melee' | 'ranged';
  accuracy: string;
  damage: string;
  damageType: 'physical' | 'magical';
};

export type Armour = EquipmentBase & {
  isMartial: boolean;
  usesDex: boolean;
  dexBonus: number;
  usesIns: boolean;
  insBonus: number;
  initiativeBonus: number;
};

export type Shield = EquipmentBase & {
  isMartial: boolean;
  defenseBonus: number;
  magicDefenseBonus: number;
  initiativeBonus: number;
};

export type Equipment = Shield | Armour | Weapon;

export type User = {
  email: string;
  password: string;
};
