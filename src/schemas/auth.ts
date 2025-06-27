export const registerSchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    errorMessage: {
      required: {
        email: 'Email is a required field.',
        password: 'Password is a required field.',
      },
    },
    properties: {
      email: {
        type: 'string',
        format: 'email',
        errorMessage: {
          type: 'Email must be a string.',
          format: 'Email must be a valid email address.',
        },
      },
      password: {
        type: 'string',
        minLength: 8,
        maxLength: 40,
        errorMessage: {
          type: 'Password must be a string.',
          minLength: 'Password must not be fewer than 8 characters.',
          maxLength: 'Password must not exceed 40 characters.',
        },
      },
    },
    additionalProperties: false,
  },
};
