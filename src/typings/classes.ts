import { Bonus } from './shared';

export type ClassBenefit = {
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
