import { Router } from 'express';
import algorithmRoutes from './algorithm.routes';
import configRoutes from './config.routes';
import metricsRoutes from './metrics.routes';

const router = Router();

router.use('/algorithms', algorithmRoutes);
router.use('/config', configRoutes);
router.use('/metrics', metricsRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

export default router;
