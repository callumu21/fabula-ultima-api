export type SpellDuration = 'scene' | 'instantaneous';

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
