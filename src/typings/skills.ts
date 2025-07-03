export interface Skill {
  id: string;
  name: string;
  description: string;
  maxRank: number;
  classId: string;
}

export type CharacterSkill = Skill & {
  rank: number;
};
