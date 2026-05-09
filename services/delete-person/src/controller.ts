// Controlador: recibe el documento por URL y elimina la persona.

import { Request, Response } from 'express';
import { deletePerson } from './service';

export async function deletePersonController(req: Request, res: Response) {
  const { numero_documento } = req.params;

  // Validar formato del documento
  if (!/^[0-9]{1,10}$/.test(numero_documento)) {
    return res.status(400).json({ error: 'Número de documento inválido' });
  }

  // user_id y user_email vienen opcionales en el body
  const { user_id, user_email } = req.body ?? {};

  try {
    await deletePerson(numero_documento, user_email, user_id);
    return res.status(200).json({ message: 'Persona eliminada correctamente' });
  } catch (error: any) {
    if (error.message === 'PERSON_NOT_FOUND') {
      return res.status(404).json({ error: 'No existe una persona con ese documento' });
    }
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}