// Controlador: recibe el documento por URL y los cambios por body.
// Valida, llama al service y maneja los errores.

import { Request, Response } from 'express';
import { updatePersonSchema } from './validators';
import { updatePerson } from './service';

export async function updatePersonController(req: Request, res: Response) {
  const { numero_documento } = req.params;

  // Validar que el documento en la URL tiene formato correcto
  if (!/^[0-9]{1,10}$/.test(numero_documento)) {
    return res.status(400).json({ error: 'Número de documento inválido' });
  }

  // Validar el body con Zod
  const parsed = updatePersonSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Datos inválidos',
      details: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    await updatePerson(numero_documento, parsed.data);
    return res.status(200).json({ message: 'Persona actualizada correctamente' });
  } catch (error: any) {
    if (error.message === 'PERSON_NOT_FOUND') {
      return res.status(404).json({ error: 'No existe una persona con ese documento' });
    }
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}