import { Router } from 'express';
import { configController } from '../controllers';

const router = Router();

router.get('/defaults', configController.getDefaultOptions);

export default router;
