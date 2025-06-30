export type Attribute = 'DEX' | 'INS' | 'MIG' | 'WLP';

export type StatusEffectName = 'Slow' | 'Dazed' | 'Weak' | 'Shaken' | 'Enraged' | 'Poisoned';

export interface StatusEffect {
  id: string;
  name: StatusEffectName;
  affectedAttributes: Attribute[];
}
