import { notFound } from '../utils/http-error.js';

export function notFoundMiddleware(req, res, next) {
  next(
    notFound(
      `Route ${req.method} ${req.originalUrl} not found`
    )
  );
}