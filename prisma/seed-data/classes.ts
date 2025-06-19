export const classes = [
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
        type: 'automatic',
        description: 'Permanently increase your maximum Mind Points by 5.',
        bonus: { stat: 'MP', increase: 5 },
      },
    ],
  },
];
