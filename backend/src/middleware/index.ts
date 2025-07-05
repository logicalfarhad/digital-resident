import { Request, Response, NextFunction } from 'express';
import cors, { CorsOptions } from 'cors';
import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import config from '../config';
import { ErrorResponse, CustomError } from '../types';

/**
 * CORS configuration middleware
 */
export const corsMiddleware = cors({
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void): void {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Allow requests from the specified frontend domain
        if (config.allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // Block all other origins
        const error = new Error('Not allowed by CORS') as CustomError;
        error.statusCode = 403;
        return callback(error);
    },
    credentials: true,
    optionsSuccessStatus: 200
} as CorsOptions);

/**
 * Rate limiting middleware for API endpoints
 */
export const rateLimitMiddleware: RateLimitRequestHandler = rateLimit({
    windowMs: config.rateLimitWindow,
    max: config.rateLimitMax,
    message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: config.rateLimitWindow / 1000
    } as ErrorResponse,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});


/**
 * Request logging middleware
 */
export const loggingMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const start = Date.now();

    // Log request
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${req.ip}`);

    // Log response when finished
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
    });

    next();
};

/**
 * Global error handling middleware
 */
export const errorMiddleware = (err: CustomError, req: Request, res: Response<ErrorResponse>, next: NextFunction): void => {
    // CORS error handling
    if (err.message === 'Not allowed by CORS') {
        res.status(403).json({
            error: 'CORS policy violation',
            message: 'Access denied from this origin'
        });
        return;
    }

    // Rate limit error handling
    if (err.message && err.message.includes('Too many requests')) {
        res.status(429).json({
            error: 'Rate limit exceeded',
            message: err.message,
            retryAfter: 60
        });
        return;
    }

    // JSON parsing error handling
    if (err instanceof SyntaxError && 'body' in err) {
        res.status(400).json({
            error: 'Invalid JSON',
            message: 'Request body contains invalid JSON'
        });
        return;
    }

    // Log error for debugging
    console.error('Unhandled error:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        timestamp: new Date().toISOString()
    });

    // Default error response
    res.status(err.statusCode || 500).json({
        error: 'Internal server error',
        message: config.nodeEnv === 'production'
            ? 'Something went wrong'
            : err.message || 'Unknown error'
    });
};

/**
 * 404 Not Found middleware
 */
export const notFoundMiddleware = (req: Request, res: Response<ErrorResponse>): void => {
    res.status(404).json({
        error: 'Not found',
        message: 'The requested endpoint does not exist'
    });
};