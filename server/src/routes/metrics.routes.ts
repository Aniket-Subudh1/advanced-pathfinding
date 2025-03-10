import { Router } from 'express';
import { getAlgorithmMetrics, getAlgorithmMetricsById } from '../controllers/metrics.controller';

const router = Router();

router.get('/algorithms', getAlgorithmMetrics);

router.get('/algorithms/:id', getAlgorithmMetricsById);

export default router;