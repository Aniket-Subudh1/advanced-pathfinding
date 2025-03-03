import { Router } from 'express';
import { algorithmController } from '../controllers';

const router = Router();

// GET /api/algorithms/list - Get all available algorithms
router.get('/list', algorithmController.listAlgorithms);

// GET /api/algorithms/:id - Get details for a specific algorithm
router.get('/:id', algorithmController.getAlgorithmDetails);

// POST /api/algorithms/execute - Execute an algorithm
router.post('/execute', algorithmController.executeAlgorithm);

export default router;
