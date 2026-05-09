// Define los endpoints HTTP del servicio.
// Por ahora solo hay uno: POST /personas

import { Router } from 'express';
import { createPersonController } from './controller';

const router = Router();

router.post('/personas', createPersonController);

export default router;