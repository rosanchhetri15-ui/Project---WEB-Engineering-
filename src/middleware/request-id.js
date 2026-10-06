import { randomUUID } from 'node:crypto';

export function requestId(req, res, next) {
  const id =
    req.get('X-Request-Id') ||
    randomUUID();

  req.requestId = id;

  res.setHeader(
    'X-Request-Id',
    id
  );

  next();
}