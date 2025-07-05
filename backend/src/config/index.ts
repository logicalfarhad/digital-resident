// src/config/index.ts
import { AppConfig } from '../types';

/**
 * Centralized application configuration
 * Single source of truth for all configuration values
 */
export const config: AppConfig = {
    // Server configuration
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: (process.env.NODE_ENV as AppConfig['nodeEnv']) || 'development',

    // External API configuration
    coinGeckoApiUrl: process.env.COINGECKO_API_URL || 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',

    // CORS configuration
    allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:8000,http://127.0.0.1:8000').split(','),

    // Cache configuration
    cacheDuration: parseInt(process.env.CACHE_DURATION || '6000', 10), // 6 seconds
    realPriceCacheDuration: parseInt(process.env.REAL_PRICE_CACHE_DURATION || '600000', 10), // 10 minutes

    // Fallback configuration
    fallbackEthPrice: parseFloat(process.env.FALLBACK_ETH_PRICE || '3000'),

    // Rate limiting configuration
    rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '60000', 10), // 1 minute
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '10', 10) // 10 requests per window
};

/**
 * Validation function to ensure all required config values are present
 */
export function validateConfig(): void {
    const requiredEnvVars = [
        { key: 'PORT', value: config.port, type: 'number' },
        { key: 'CACHE_DURATION', value: config.cacheDuration, type: 'number' },
        { key: 'RATE_LIMIT_MAX', value: config.rateLimitMax, type: 'number' }
    ];

    const errors: string[] = [];

    requiredEnvVars.forEach(({ key, value, type }) => {
        if (type === 'number' && (isNaN(value) || value <= 0)) {
            errors.push(`${key} must be a positive number`);
        }
    });

    if (errors.length > 0) {
        console.error('Configuration validation failed:');
        errors.forEach(error => console.error(`  - ${error}`));
        process.exit(1);
    }
}

/**
 * Pretty print configuration for startup logging
 */
export function logConfig(): void {
    console.log('Application Configuration:');
    console.log(`Port: ${config.port}`);
    console.log(`Environment: ${config.nodeEnv}`);
    console.log(`Cache Duration: ${config.cacheDuration / 1000}s`);
    console.log(`Real Price Cache: ${config.realPriceCacheDuration / 60000}m`);
    console.log(`Rate Limit: ${config.rateLimitMax} req/${config.rateLimitWindow / 1000}s`);
    console.log(`Fallback ETH Price: $${config.fallbackEthPrice}`);
}

/**
 * Environment-specific configuration overrides
 */
export const getEnvironmentConfig = () => {
    const baseConfig = { ...config };

    switch (config.nodeEnv) {
        case 'test':
            return {
                ...baseConfig,
                cacheDuration: 100, // Faster cache expiry for tests
                realPriceCacheDuration: 1000,
                rateLimitMax: 1000 // Higher limit for tests
            };

        case 'production':
            return {
                ...baseConfig,
                // Production-specific overrides can go here
            };

        case 'development':
        default:
            return baseConfig;
    }
};

// Export the environment-specific config as default
export default getEnvironmentConfig();