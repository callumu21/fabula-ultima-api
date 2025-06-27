export type BonusStat = 'MP' | 'HP' | 'IP';

export type Bonus =
  | { stat: BonusStat; increase: number }
  | {
      proficiency:
        | 'Ritualism'
        | 'Projects'
        | 'martial melee weapons'
        | 'martial ranged weapons'
        | 'martial shields'
        | 'martial armour';
    };
