const isString = (value) =>
  typeof value === 'string';

export const trim = (value) =>
  value.trim();

export const lowercase = (value) =>
  value.toLowerCase();

export const string = ({ min = 1, max = Infinity } = {}) =>
  (value) => {
    if (!isString(value)) {
      return 'must be a string';
    }

    if (value.length < min) {
      return `must be at least ${min} characters`;
    }

    if (value.length > max) {
      return `must be at most ${max} characters`;
    }

    return null;
  };

export const integer = ({
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER
} = {}) =>
  (value) => {
    if (!Number.isInteger(value)) {
      return 'must be an integer';
    }

    if (value < min || value > max) {
      return `must be between ${min} and ${max}`;
    }

    return null;
  };

export const money = ({
  min = 0,
  max = Number.MAX_SAFE_INTEGER
} = {}) =>
  (value) => {
    if (
      typeof value !== 'number' ||
      !Number.isFinite(value)
    ) {
      return 'must be a valid number';
    }

    if (value < min || value > max) {
      return `must be between ${min} and ${max}`;
    }

    return null;
  };

export const oneOf = (values) =>
  (value) => {
    if (!values.includes(value)) {
      return `must be one of: ${values.join(', ')}`;
    }

    return null;
  };

export const email = () =>
  (value) => {
    if (!isString(value)) {
      return 'must be a string';
    }

    const pattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return pattern.test(value)
      ? null
      : 'must be a valid email address';
  };

export const password = () =>
  (value) => {
    if (!isString(value)) {
      return 'must be a string';
    }

    if (value.length < 8) {
      return 'must be at least 8 characters';
    }

    if (value.length > 72) {
      return 'must be at most 72 characters';
    }

    if (!/[A-Za-z]/.test(value)) {
      return 'must contain at least one letter';
    }

    if (!/[0-9]/.test(value)) {
      return 'must contain at least one digit';
    }

    return null;
  };

export const phone = () =>
  (value) => {
    if (!isString(value)) {
      return 'must be a string';
    }

    const digits = value.replace(/\D/g, '');

    if (
      digits.length < 7 ||
      digits.length > 15
    ) {
      return 'must contain between 7 and 15 digits';
    }

    return null;
  };

export const pastDate = () =>
  (value) => {
    if (!isString(value)) {
      return 'must be a string';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return 'must be a valid date';
    }

    if (date >= new Date()) {
      return 'must be in the past';
    }

    return null;
  };

export const object = (shape) =>
  (value) => {
    if (
      value === null ||
      typeof value !== 'object' ||
      Array.isArray(value)
    ) {
      return 'must be an object';
    }

    for (const [field, rule] of Object.entries(shape)) {
      const fieldValue = value[field];

      if (fieldValue === undefined) {
        if (rule.required) {
          return `${field} is required`;
        }

        continue;
      }

      const error = rule.check(fieldValue);

      if (error) {
        return `${field} ${error}`;
      }
    }

    for (const field of Object.keys(value)) {
      if (!(field in shape)) {
        return `${field} is not allowed`;
      }
    }

    return null;
  };

export const digitsOnly = () =>
  (value) => {
    if (!isString(value)) {
      return 'must be a string';
    }

    return /^\d+$/.test(value)
      ? null
      : 'must contain digits only';
  };