interface EquipmentBase {
  id: string;
  name: string;
  cost: number;
  isBasic: boolean;
  quality: null | string;
}

export type WeaponType =
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
