// Endpoint para consultar logs.
// GET /logs con filtros opcionales como query params

import { Router } from 'express';
import { queryLogsController } from './controller';

const router = Router();

router.get('/logs', queryLogsController);

export default router;