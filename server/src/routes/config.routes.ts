import { Router } from 'express';
import { configController } from '../controllers';

const router = Router();

// GET /api/config/defaults - Get default algorithm options
router.get('/defaults', configController.getDefaultOptions);

export default router;
