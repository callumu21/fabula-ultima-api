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
