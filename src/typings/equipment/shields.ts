interface EquipmentBase {
  id: string;
  name: string;
  cost: number;
  isBasic: boolean;
  quality: null | string;
}

export type Shield = EquipmentBase & {
  isMartial: boolean;
  defenseBonus: number;
  magicDefenseBonus: number;
  initiativeBonus: number;
};
