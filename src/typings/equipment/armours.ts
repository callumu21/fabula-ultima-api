interface EquipmentBase {
  id: string;
  name: string;
  cost: number;
  isBasic: boolean;
  quality: null | string;
}

export type Armour = EquipmentBase & {
  isMartial: boolean;
  usesDex: boolean;
  dexBonus: number;
  usesIns: boolean;
  insBonus: number;
  initiativeBonus: number;
};
