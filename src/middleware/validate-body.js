import { validate } from '../validators/validate.js';

export const validateBody =
  (schema, options = {}) =>
  (req, res, next) => {
    try {
      req.body = validate(
        schema,
        req.body,
        options
      );

      next();
    } catch (error) {
      next(error);
    }
  };
  