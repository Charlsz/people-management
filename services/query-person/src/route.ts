// Endpoint para consultar una persona.
// GET /personas/:numero_documento

import { Router } from 'express';
import { queryPersonController } from './controller';

const router = Router();

router.get('/personas/:numero_documento', queryPersonController);

export default router;