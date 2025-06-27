import { FastifySchema } from 'fastify';

export const createWeaponSchema: FastifySchema = {
  body: {
    type: 'object',
    required: [
      'name',
      'cost',
      'isBasic',
      'category',
      'isMartial',
      'handsRequired',
      'range',
      'accuracy',
      'damage',
      'damageType',
    ],
    errorMessage: {
      required: {
        name: 'name is a required field.',
        cost: 'cost is a required field.',
        isBasic: 'isBasic is a required field.',
        category: 'category is a required field.',
        isMartial: 'isMartial is a required field.',
        handsRequired: 'handsRequired is a required field.',
        range: 'range is a required field.',
        accuracy: 'accuracy is a required field.',
        damage: 'damage is a required field.',
        damageType: 'damageType is a required field.',
      },
    },
    properties: {
      name: {
        type: 'string',
        minLength: 3,
        maxLength: 40,
        pattern: '^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$',
        errorMessage: {
          type: 'Name must be a string.',
          pattern: 'Invalid name. Name can only have letters, digits and spaces.',
          minLength: 'Name must be at least 3 characters.',
          maxLength: 'Name must not exceed 40 characters.',
        },
      },
      cost: {
        type: 'number',
        minimum: 0,
        errorMessage: {
          type: 'Cost must be a number.',
          minimum: 'Cost cannot be less than 0.',
        },
      },
      isBasic: {
        type: 'boolean',
        errorMessage: {
          type: 'isBasic must be a boolean.',
        },
      },
      category: {
        type: 'string',
        enum: [
          'arcane',
          'bow',
          'brawling',
          'dagger',
          'firearm',
          'flail',
          'heavy',
          'spear',
          'sword',
          'thrown',
        ],
        errorMessage: {
          type: 'Category must be a string.',
          enum: 'Category must be a valid weapon category.',
        },
      },
      isMartial: {
        type: 'boolean',
        errorMessage: {
          type: 'isMartial must be a boolean.',
        },
      },
      handsRequired: {
        type: 'number',
        minimum: 1,
        maximum: 2,
        errorMessage: {
          type: 'handsRequired must be a number.',
          minimum: 'handsRequired cannot be lower than 1.',
          maximum: 'handsRequired cannot be more than 2.',
        },
      },
      range: {
        type: 'string',
        enum: ['melee', 'ranged'],
        errorMessage: {
          type: 'Range must be a string.',
          enum: 'Range must be either melee or ranged.',
        },
      },
      accuracy: {
        type: 'string',
        pattern: '^\\[(MIG|DEX|INS|WLP) \\+ (MIG|DEX|INS|WLP)\\](?: [+-]\\d+)?$',
        errorMessage: {
          type: 'Accuracy must be a string.',
          pattern: 'Accuracy must be of the format [ATT + ATT] or [ATT + ATT] + 1',
        },
      },
      damage: {
        type: 'string',
        pattern: '^\\[HR [+-] \\d+\\]$',
        errorMessage: {
          type: 'Damage must be a string.',
          pattern: 'Damage must be of the format [HR + X] or [HR - X].',
        },
      },
      damageType: {
        type: 'string',
        enum: ['physical', 'magical'],
        errorMessage: {
          type: 'damageType must be a string.',
          enum: 'damageType must be either physical or magical.',
        },
      },
      quality: {
        type: ['string', 'null'],
        errorMessage: {
          type: 'Quality must be either a string or null.',
        },
      },
    },
    additionalProperties: false,
  },
};
