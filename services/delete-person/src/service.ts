// Lógica para eliminar una persona.
// Guarda el nombre antes de borrar para dejarlo en el log.
// Registra la operación con tipo 'delete'.

import { pool } from './db';

export async function deletePerson(numeroDocumento: string, userEmail?: string, userId?: string) {
  // Primero buscar la persona para guardar su nombre en el log
  const found = await pool.query(
    `SELECT primer_nombre, apellidos FROM personas WHERE numero_documento = $1`,
    [numeroDocumento]
  );

  if (found.rowCount === 0) {
    throw new Error('PERSON_NOT_FOUND');
  }

  const { primer_nombre, apellidos } = found.rows[0];

  // Eliminar la persona
  await pool.query(
    `DELETE FROM personas WHERE numero_documento = $1`,
    [numeroDocumento]
  );

  // Registrar en el log DESPUÉS de borrar
  // numero_documento se guarda como texto aunque ya no exista en personas
  await pool.query(
    `INSERT INTO logs (numero_documento, tipo_transaccion, descripcion, user_id, user_email)
     VALUES ($1, 'delete', $2, $3, $4)`,
    [
      numeroDocumento,
      `Persona eliminada: ${primer_nombre} ${apellidos}`,
      userId    ?? null,
      userEmail ?? null,
    ]
  );
}