import express from 'express';

import { config } from './config/env.js';

import { requestId } from './middleware/request-id.js';
import { requestLogger } from './middleware/request-logger.js';
import { notFoundMiddleware } from './middleware/not-found.js';
import { errorHandler } from './middleware/error-handler.js';

import { UsersController } from './controllers/users.controller.js';
import { createUsersRouter } from './routes/users.routes.js';

// Builds the Express app.
// Does NOT call listen() — server.js does that.
export function createApp() {
  const app = express();

  app.disable('x-powered-by');

  // Trust X-Forwarded-* only from a local proxy.
  app.set('trust proxy', 'loopback');

  // Pre-route middleware.
  app.use(requestId);

  if (!config.isTest) {
    app.use(requestLogger);
  }

  app.use(
    express.json({
      limit: config.bodyLimit
    })
  );

  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      uptimeSec: Math.round(process.uptime())
    });
  });

  // Each app gets its own controller + service +
  // in-memory store. No container.
  app.use(
    '/api/v1/users',
    createUsersRouter(new UsersController())
  );

  // Fallbacks must be LAST.
  app.use(notFoundMiddleware);
  app.use(errorHandler);

  return app;
}