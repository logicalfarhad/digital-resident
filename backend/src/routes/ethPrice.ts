import { Router, Request, Response } from 'express';
import { getCachedPrice } from '../services/priceService';
import { ErrorResponse, EthPriceResponse } from '../types';

const router: Router = Router();

/**
 * GET /api/eth-price
 * Returns current ETH price with simulation
 */
router.get('/eth-price', async (req: Request, res: Response<EthPriceResponse | ErrorResponse>): Promise<void> => {
    try {
        const priceData: EthPriceResponse = await getCachedPrice();
        res.json(priceData);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error in /api/eth-price:', errorMessage);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Unable to fetch ETH price'
        });
    }
});

export default router;