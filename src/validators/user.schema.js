import {
  email,
  object,
  password,
  pastDate,
  phone,
  string,
  trim
} from './rules.js';

const addressShape = {
  street: {
    required: true,
    check: string({ max: 120 }),
    transform: trim
  },

  city: {
    required: true,
    check: string({ max: 80 }),
    transform: trim
  },

  postalCode: {
    required: false,
    check: string({ max: 20 }),
    transform: trim
  },

  country: {
    required: true,
    check: string({ max: 80 }),
    transform: trim
  }
};

export const createUserSchema = {
  firstName: {
    required: true,
    check: string({ max: 50 }),
    transform: trim
  },

  lastName: {
    required: true,
    check: string({ max: 50 }),
    transform: trim
  },

  email: {
    required: true,
    check: email(),
    transform: (value) => value.trim().toLowerCase()
  },

  password: {
    required: true,
    check: password()
  },

  phone: {
    required: false,
    check: phone(),
    transform: trim
  },

  dateOfBirth: {
    required: false,
    check: pastDate()
  },

  address: {
    required: false,
    check: object(addressShape)
  }
};

const {
  password: _password,
  ...updateFields
} = createUserSchema;

export const updateUserSchema = updateFields;