// Endpoint para eliminar una persona.
// DELETE /personas/:numero_documento

import { Router } from 'express';
import { deletePersonController } from './controller';

const router = Router();

router.delete('/personas/:numero_documento', deletePersonController);

export default router;