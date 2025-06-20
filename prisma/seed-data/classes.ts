import { type Class } from '../../src/typings/index';

export const classes: Class[] = [
  {
    id: 'arcanist',
    name: 'Arcanist',
    description:
      'Arcanists can fall into a deep trance and temporarily project a considerable portion of their soul outside the body, giving it physical form. Surrounded by this magical shroud, the Arcanist gains a variety of supernatural abilities; these summoned forms are said to be manifestations of the ancestral souls belonging to mythical entities of legend, known as the Arcana.\n In some worlds, the Arcana are even worshipped as deities.',
    questions: [
      'Where do your powers come from? Are they a gift from your bloodline?',
      'Have you ever communicated with an Arcanum, or are they silent and distant?',
      'Do people see you as mysterious, powerful, or otherworldly?',
      'Are there many practicing you art, or are you the exception?',
    ],
    benefits: [
      {
        type: 'AUTOMATIC',
        description: 'Permanently increase your maximum Mind Points by 5.',
        bonus: { stat: 'MP', increase: 5 },
      },
    ],
  },
  {
    id: 'elementalist',
    name: 'Elementalist',
    description:
      "An Elementalist has learned to channel the souls that flow within the basic elements of creation: Air, Earth, Fire and Water. Some of them develop complex spells to contain the powerful energies of nature; others seek its protection in harmony and communion.\n Elemental magic can be highly destructive, cuasing damage and inflicting negative status effects. Due to this, there are many who would covet an Elementalist's abilities...often for nefarious purposes.",
    questions: [
      'Who trained you in the way of the elements?',
      'Your magic can be devestating...are you afraid of yourself?',
      'Elemental magic is often used in war. Did you serve in the military?',
      'What does your magic look like?',
    ],
    benefits: [
      {
        type: 'AUTOMATIC',
        description: 'Permanently increate your maximum Mind Points by 5',
        bonus: { stat: 'MP', increase: 5 },
      },
      {
        type: 'AUTOMATIC',
        description: 'Your may perform Rituals whose effects fall within the Ritualism discipline.',
        bonus: { proficieny: 'Ritualism' },
      },
    ],
  },
];
