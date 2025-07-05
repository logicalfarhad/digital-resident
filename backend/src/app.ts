import express, { Application } from 'express';
import config from './config';
import {
    corsMiddleware,
    rateLimitMiddleware,
    loggingMiddleware,
    errorMiddleware,
    notFoundMiddleware
} from './middleware';
import routes from './routes';

/**
 * Creates and configures the Express application
 * @returns Configured Express application instance
 */
function createApp(): Application {
    const app: Application = express();

    // Request logging
    if (config.nodeEnv !== 'test') {
        app.use(loggingMiddleware);
    }

    // CORS middleware
    app.use(corsMiddleware);

    // Rate limiting for API routes only
    app.use('/api', rateLimitMiddleware);

    // Mount all routes
    app.use(routes);

    // 404 handler (must be after all routes)
    app.use(notFoundMiddleware);

    // Global error handler (must be last)
    app.use(errorMiddleware);

    return app;
}

export default createApp;