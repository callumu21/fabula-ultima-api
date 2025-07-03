import { Accessory, Armour, Equipment, Shield, Weapon } from './equipment';
import { CharacterSkill } from './skills';
import { Spell } from './spells';
import { StatusEffect } from './status-effects';

export type BondEmotion =
  | 'admiration'
  | 'loyalty'
  | 'affection'
  | 'inferiority'
  | 'mistrust'
  | 'hatred';

export interface Bond {
  name: string;
  emotions: BondEmotion[];
}

export type DieSize = 'd6' | 'd8' | 'd10' | 'd12';

export interface AttributeSet {
  base: DieSize;
  current: DieSize;
}

export interface Attributes {
  dexterity: AttributeSet;
  insight: AttributeSet;
  might: AttributeSet;
  willpower: AttributeSet;
}

export interface Resource {
  max: number;
  current: number;
}

export interface ClassLevel {
  name: string;
  level: number;
}

export interface EquipmentSlots {
  mainHand: Weapon | Shield | null;
  offHand: Weapon | Shield | null;
  armour: Armour | null;
  accessory: Accessory | null;
}

export interface Character {
  id: string;
  name: string;
  identity: string;
  theme: string;
  origin: string;
  pronouns: string;
  profilePicture?: string;

  bonds: Bond[];

  attributes: Attributes;

  hitPoints: Resource;
  mindPoints: Resource;
  inventoryPoints: Resource;

  statusEffects: StatusEffect[];

  classes: ClassLevel[];
  skills: CharacterSkill[];

  spells: Spell[];

  equipment: {
    slots: EquipmentSlots;
    backpack: Equipment[];
  };

  zenit: number;

  initiativeModifier: number;
  defense: number;
  magicDefense: number;
}
