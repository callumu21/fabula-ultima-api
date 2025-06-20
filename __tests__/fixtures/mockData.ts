import { type Class, type Skill, type Spell } from '../../src/typings/index';

type MockFactory<T> = (overrides?: Partial<T>) => T;

export const createMockClass: MockFactory<Class> = (overrides = {}) => {
  return {
    id: 'test-class-id',
    name: 'Test Class',
    description: 'Test description',
    questions: ['Question 1', 'Question 2'],
    benefits: [
      {
        type: 'AUTOMATIC',
        description: 'Permanently increase your maximum Mind Points by 5.',
        bonus: { stat: 'MP', increase: 5 },
      },
    ],
    ...overrides,
  };
};

export const createMockSkill: MockFactory<Skill> = (overrides = {}) => {
  return {
    id: 'test-skill',
    name: 'Test Skill',
    description: 'A test skill',
    maxRank: 1,
    classId: createMockClass().id,
    ...overrides,
  };
};

export const createMockSpell: MockFactory<Spell> = (overrides = {}) => {
  return {
    id: 'mock-spell',
    name: 'Mock Spell',
    description: 'A mock spell',
    isOffensive: false,
    mpCost: '10',
    target: '3 creatures',
    duration: 'INSTANTANEOUS',
    classId: createMockClass().id,
    ...overrides,
  };
};
