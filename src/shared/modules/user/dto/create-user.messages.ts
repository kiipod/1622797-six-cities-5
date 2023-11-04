export const CreateUserMessages = {
  name: {
    invalidFormat: 'Name is required',
    lengthField: 'min length is 1, max is 15',
  },
  email: {
    invalidFormat: 'Email must be a valid address'
  },
  password: {
    invalidFormat: 'Password is required',
    lengthField: 'min length for password is 6, max is 12'
  },
  role: {
    invalidFormat: 'Role must be Normal or Pro',
  }
} as const;
