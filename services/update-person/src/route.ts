// Endpoint para modificar una persona.
// El documento va en la URL: PATCH /personas/:numero_documento

import { Router } from 'express';
import { updatePersonController } from './controller';

const router = Router();

// PATCH porque solo modifica campos específicos, no reemplaza todo el registro
router.patch('/personas/:numero_documento', updatePersonController);

export default router;