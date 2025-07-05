import axios, { AxiosResponse } from 'axios';
import config from '../config';
import {
    EthPriceResponse,
    CoinGeckoResponse,
    PriceCache,
    SimulatedPriceResult
} from '../types';

// Price cache object
let priceCache: PriceCache = {
    price: null,
    lastUpdated: null,
    up: false,
    realPrice: null,
    lastFetch: null
};

/**
 * Fetches real ETH price from CoinGecko API
 * @returns Promise<number> - Current ETH price in USD
 * @throws Error if API request fails or response is invalid
 */
export async function fetchRealEthPrice(): Promise<number> {
    try {
        const response: AxiosResponse<CoinGeckoResponse> = await axios.get(
            config.coinGeckoApiUrl,
            {
                timeout: 5000,
                headers: {
                    'User-Agent': 'ETH-Price-Service/1.0'
                }
            }
        );

        if (response.data && response.data.ethereum && response.data.ethereum.usd) {
            return response.data.ethereum.usd;
        }

        throw new Error('Invalid response format from CoinGecko');
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error fetching real ETH price:', errorMessage);
        throw error;
    }
}

/**
 * Generates a simulated price with ±0-2% change from base price
 * @param basePrice - The base price to apply changes to
 * @param previousPrice - Previous price to determine direction
 * @returns SimulatedPriceResult with new price and direction
 */
export function generateSimulatedPrice(basePrice: number, previousPrice: number | null): SimulatedPriceResult {
    // Generate random percentage change between -2% and +2%
    const changePercent: number = (Math.random() - 0.5) * 4; // -2 to +2
    const changeAmount: number = basePrice * (changePercent / 100);
    const newPrice: number = basePrice + changeAmount;

    // Determine if price went up compared to previous price
    const up: boolean = previousPrice ? newPrice > previousPrice : Math.random() > 0.5;

    return {
        price: parseFloat(newPrice.toFixed(4)), // Round to 4 decimal places
        up: up
    };
}

/**
 * Gets cached price or generates new simulated price
 * Handles both real price caching (5 min) and simulated price caching (6 sec)
 * @returns Promise<EthPriceResponse> - Current price data
 */
export async function getCachedPrice(): Promise<EthPriceResponse> {
    const now: number = Date.now();

    // Check if we need to fetch real price (first time or cache expired)
    if (!priceCache.realPrice || !priceCache.lastFetch || (now - priceCache.lastFetch) > config.realPriceCacheDuration) {
        try {
            priceCache.realPrice = await fetchRealEthPrice();
            priceCache.lastFetch = now;
            console.log(`Fetched real ETH price: ${priceCache.realPrice}`);
        } catch (error) {
            // If we can't fetch real price and don't have cached real price, use fallback
            if (!priceCache.realPrice) {
                priceCache.realPrice = config.fallbackEthPrice;
                priceCache.lastFetch = now;
                console.log('Using fallback ETH price due to fetch error');
            }
        }
    }

    // Check if cached simulated price is still valid
    if (priceCache.price && priceCache.lastUpdated && (now - new Date(priceCache.lastUpdated).getTime()) < config.cacheDuration) {
        return {
            price: priceCache.price,
            lastUpdated: priceCache.lastUpdated,
            up: priceCache.up
        };
    }

    // Generate new simulated price
    const previousPrice: number | null = priceCache.price;
    const { price, up }: SimulatedPriceResult = generateSimulatedPrice(priceCache.realPrice!, previousPrice);

    // Update cache
    priceCache.price = price;
    priceCache.lastUpdated = new Date().toISOString();
    priceCache.up = up;

    return {
        price: priceCache.price,
        lastUpdated: priceCache.lastUpdated,
        up: priceCache.up
    };
}

/**
 * Resets the price cache (useful for testing)
 */
export function resetPriceCache(): void {
    priceCache = {
        price: null,
        lastUpdated: null,
        up: false,
        realPrice: null,
        lastFetch: null
    };
}

/**
 * Gets current cache state (useful for testing and monitoring)
 */
export function getPriceCacheState(): Readonly<PriceCache> {
    return { ...priceCache };
}

// Export constants for testing
export {
    config as serviceConfig
};