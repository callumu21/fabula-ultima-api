export const mockClass = {
  id: 'test-class-id',
  name: 'Test Class',
  description: 'Test description',
  questions: ['Question 1', 'Question 2'],
  benefits: [
    {
      type: 'automatic',
      description: 'Permanently increase your maximum Mind Points by 5.',
      bonus: { stat: 'MP', increase: 5 },
    },
  ],
};

export const mockSkills = [
  {
    id: 'test-skill-1',
    name: 'Test Skill 1',
    description: 'A test skill',
    classId: mockClass.id,
  },
  {
    id: 'test-skill-2',
    name: 'Test Skill 2',
    description: 'A test skill',
    classId: mockClass.id,
  },
];
