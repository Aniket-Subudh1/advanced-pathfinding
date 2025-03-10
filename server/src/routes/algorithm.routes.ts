import { Router } from 'express';
import { algorithmController } from '../controllers';

const router = Router();

router.get('/list', algorithmController.listAlgorithms);

router.get('/:id', algorithmController.getAlgorithmDetails);

router.post('/execute', algorithmController.executeAlgorithm);

export default router;
