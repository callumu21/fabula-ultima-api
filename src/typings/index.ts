type Bonus =
  | {
      stat: string;
      increase: number;
    }
  | {
      proficieny: 'Ritualism';
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

type SpellDuration = 'SCENE' | 'INSTANTANEOUS';

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
