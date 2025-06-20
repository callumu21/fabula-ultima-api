import { type Spell } from '../../src/typings/index';

export const spells: Spell[] = [
  {
    id: 'elemental-shroud',
    name: 'Elemental Shroud',
    description:
      'You weave magical energy and protect the targets from the fury of the elements. Choose a damage type: air, bolt, earth, fire, or ice. Until this spell ends, each target gains Resistance against the chosen damage type.',
    isOffensive: false,
    mpCost: '5 x T',
    target: 'Up to 3 creatures',
    duration: 'SCENE',
    classId: 'elementalist',
  },
  {
    id: 'elemental-weapon',
    name: 'Elemental Weapon',
    description:
      'You imbue a weapon with elemental energy. Choose a damage type: air, bolt, earth, fire, or ice. Until this spell ends, all damage dealt by the weapon becomes of the chosen damage type. If you have that weapon equipped while you cast this spell, you may perform a free attack with it as part of the same action. This spell can only be cast on a weapon equipped by a willing creature.',
    isOffensive: false,
    mpCost: '10',
    target: 'One weapon',
    duration: 'SCENE',
    classId: 'elementalist',
  },
  {
    id: 'flare',
    name: 'Flare',
    description:
      'You channel a single ray of fire towards your foe, its temperature so high that it will pierce through most defenses. The target suffers 【HR + 25】 fire damage. Damage dealt by this spell ignores Resistances.',
    isOffensive: true,
    mpCost: '20',
    target: 'One creature',
    duration: 'INSTANTANEOUS',
    classId: 'elementalist',
  },
  {
    id: 'fulgur',
    name: 'Fulgur',
    description:
      'You weave electricity into a wave of crackling bolts. Each target hit by this spell suffers 【HR + 15】 bolt damage. Opportunity: Each target hit by this spell suffers dazed.',
    isOffensive: true,
    mpCost: '20 x T',
    target: 'Up to three creatures',
    duration: 'INSTANTANEOUS',
    classId: 'elementalist',
  },
  {
    id: 'glacies',
    name: 'Glacies',
    description:
      'You coat your foes under a thick layer of frost. Each target hit by this spell suffers 【HR+ 15】 ice damage. Opportunity: Each target hit by this spell suffers slow.',
    isOffensive: true,
    mpCost: '10 x T',
    target: 'Up to three creatures',
    duration: 'INSTANTANEOUS',
    classId: 'elementalist',
  },
];
