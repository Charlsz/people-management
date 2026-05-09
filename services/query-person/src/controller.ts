// Controlador: recibe el documento por URL y devuelve los datos de la persona.

import { Request, Response } from 'express';
import { queryPerson } from './service';

export async function queryPersonController(req: Request, res: Response) {
  const { numero_documento } = req.params;

  // Validar formato del documento
  if (!/^[0-9]{1,10}$/.test(numero_documento)) {
    return res.status(400).json({ error: 'Número de documento inválido' });
  }

  const { user_id, user_email } = req.query as { user_id?: string; user_email?: string };

  try {
    const persona = await queryPerson(numero_documento, user_email, user_id);
    return res.status(200).json(persona);
  } catch (error: any) {
    if (error.message === 'PERSON_NOT_FOUND') {
      return res.status(404).json({ error: 'No existe una persona con ese documento' });
    }
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}