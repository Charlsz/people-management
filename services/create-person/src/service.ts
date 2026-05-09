// Lógica de negocio del servicio.
// Hace dos cosas: inserta la persona y registra la operación en el log.

import { pool } from './db';
import { CreatePersonInput } from './validators';

export async function createPerson(data: CreatePersonInput) {
  // 1. Insertar la persona en la tabla personas
  await pool.query(
    `INSERT INTO personas (
      numero_documento, tipo_documento, primer_nombre, segundo_nombre,
      apellidos, fecha_nacimiento, genero, correo_electronico, celular, foto_url
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [
      data.numero_documento,
      data.tipo_documento,
      data.primer_nombre,
      data.segundo_nombre ?? null,
      data.apellidos,
      data.fecha_nacimiento,
      data.genero,
      data.correo_electronico,
      data.celular,
      data.foto_url ?? null,
    ]
  );

  // 2. Registrar la transacción en el log
  await pool.query(
    `INSERT INTO logs (numero_documento, tipo_transaccion, descripcion, user_id, user_email)
     VALUES ($1, 'create', $2, $3, $4)`,
    [
      data.numero_documento,
      `Persona creada: ${data.primer_nombre} ${data.apellidos}`,
      data.user_id    ?? null,
      data.user_email ?? null,
    ]
  );
}