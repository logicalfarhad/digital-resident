import { Router } from 'express';
import ethPriceRouter from './ethPrice';
const router: Router = Router();
// Mount route modules
router.use('/api', ethPriceRouter);
export default router;