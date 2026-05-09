// Lógica para consultar una persona por número de documento.
// Devuelve todos sus datos y registra la consulta en el log.

import { pool } from './db';

export async function queryPerson(numeroDocumento: string, userEmail?: string, userId?: string) {
  // Buscar la persona por documento
  const result = await pool.query(
    `SELECT
      numero_documento,
      tipo_documento,
      primer_nombre,
      segundo_nombre,
      apellidos,
      fecha_nacimiento,
      genero,
      correo_electronico,
      celular,
      foto_url,
      created_at,
      updated_at
    FROM personas
    WHERE numero_documento = $1`,
    [numeroDocumento]
  );

  if (result.rowCount === 0) {
    throw new Error('PERSON_NOT_FOUND');
  }

  const persona = result.rows[0];

  // Registrar la consulta en el log
  await pool.query(
    `INSERT INTO logs (numero_documento, tipo_transaccion, descripcion, user_id, user_email)
     VALUES ($1, 'query', $2, $3, $4)`,
    [
      numeroDocumento,
      `Consulta realizada: ${persona.primer_nombre} ${persona.apellidos}`,
      userId    ?? null,
      userEmail ?? null,
    ]
  );

  return persona;
}