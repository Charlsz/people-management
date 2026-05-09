// Controlador: recibe el request HTTP, valida los datos y llama al service.
// Si la validación falla devuelve 400. Si hay error de BD devuelve 500.

import { Request, Response } from 'express';
import { createPersonSchema } from './validators';
import { createPerson } from './service';

export async function createPersonController(req: Request, res: Response) {
  // Validar los datos del body con el schema de Zod
  const parsed = createPersonSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Datos inválidos',
      details: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    await createPerson(parsed.data);
    return res.status(201).json({ message: 'Persona creada correctamente' });
  } catch (error: any) {
    // Código 23505 = violación de clave única en PostgreSQL
    // Significa que ya existe una persona con ese número de documento
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Ya existe una persona con ese documento' });
    }
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}