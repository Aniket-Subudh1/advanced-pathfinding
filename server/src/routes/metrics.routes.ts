import { Router } from 'express';
import { metricsController } from '../controllers';

const router = Router();

// GET /api/metrics/algorithms - Get metrics for all algorithms
router.get('/algorithms', metricsController.getAlgorithmMetrics);

// GET /api/metrics/algorithms/:id - Get metrics for a specific algorithm
router.get('/algorithms/:id', metricsController.getAlgorithmMetricsById);

export default router;
