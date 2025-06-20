import { type Skill } from '../../src/typings/index';

export const skills: Skill[] = [
  {
    id: 'arcane-circle',
    name: 'Arcane Circle',
    description:
      "After you willingly dismiss an Arcanum on your turn during a conflict (see Core Rulebook, page 178), if that Arcanum had not been  summoned during this same turn and you have an arcane weapon equipped, you may immediately perform the Spell action for free. The spell you cast this way must have a total Mind Point cost of 【SL x 5】 or lower (you must still pay the spell's MP cost).",
    maxRank: 4,
    classId: 'arcanist',
  },
  {
    id: 'arcana-regeneration',
    name: 'Arcana Regeneration',
    description: 'When you summon an Arcanum, you immediately recover 【SL x 5】 Hit Points.',
    maxRank: 2,
    classId: 'arcanist',
  },
  {
    id: 'bind-and-summon',
    name: 'Bind and Summon',
    description:
      'You may bind Arcana to your soul and summon them later. The Game Master will tell you the details of each binding process when you first encounter the Arcanum in question.\n You may use an action and spend 40 Mind Points to summon an Arcanum you have bound: the details of this process are explained on the next page.\n If you take this Skill at character creation, you begin play with one Arcanum of your choice already bound to you, chosen from the list on the next pages. Other than that, you may only obtain new Arcana through exploration and story progression.',
    maxRank: 1,
    classId: 'arcanist',
  },
  {
    id: 'emergency-arcanum',
    name: 'Emergency Arcanum',
    description:
      'As long as you are in Crisis, the cost for summoning your Arcana is reduced by 【SL x 5】 Mind Points.',
    maxRank: 6,
    classId: 'arcanist',
  },
  {
    id: 'ritual-arcanism',
    name: 'Ritual Arcanism',
    description:
      'You may perform Rituals of the Arcanism discipline, as long as their effects fall within the domains of one or more Arcana you have bound (see Core Rulebook, page 178). Arcanism Rituals use 【WLP + WLP】 for the Magic Check.',
    maxRank: 1,
    classId: 'arcanist',
  },
];
