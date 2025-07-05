// src/types/index.ts

// =============================================================================
// API Response Types
// =============================================================================

/**
 * ETH Price API response structure
 */
export interface EthPriceResponse {
    price: number;
    lastUpdated: string;
    up: boolean;
}

/**
 * Standard error response structure
 */
export interface ErrorResponse {
    error: string;
    message: string;
    retryAfter?: number;
}

/**
 * Health check response structure
 */
export interface HealthResponse {
    status: 'healthy' | 'unhealthy';
    timestamp: string;
    uptime: number;
}

// =============================================================================
// External API Types
// =============================================================================

/**
 * CoinGecko API response structure
 */
export interface CoinGeckoResponse {
    ethereum: {
        usd: number;
    };
}

// =============================================================================
// Internal Service Types
// =============================================================================

/**
 * Price cache structure for internal state management
 */
export interface PriceCache {
    price: number | null;
    lastUpdated: string | null;
    up: boolean;
    realPrice: number | null;
    lastFetch: number | null;
}

/**
 * Result from price simulation generation
 */
export interface SimulatedPriceResult {
    price: number;
    up: boolean;
}

// =============================================================================
// Configuration Types
// =============================================================================

/**
 * Application configuration structure
 */
export interface AppConfig {
    port: number;
    nodeEnv: 'development' | 'production' | 'test';
    coinGeckoApiUrl: string;
    cacheDuration: number;
    allowedOrigins: string[];
    realPriceCacheDuration: number;
    fallbackEthPrice: number;
    rateLimitWindow: number;
    rateLimitMax: number;
}

// =============================================================================
// Express Extensions
// =============================================================================

/**
 * Custom error interface extending the standard Error
 */
export interface CustomError extends Error {
    statusCode?: number;
}

// =============================================================================
// Re-export Express Types for Convenience
// =============================================================================

export type { Request, Response, NextFunction, Application, Router } from 'express';
export type { Server } from 'http';
export type { AxiosResponse } from 'axios';