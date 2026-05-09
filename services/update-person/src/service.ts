// Lógica para modificar una persona.
// Solo actualiza los campos que llegaron en el body.
// Registra la operación en el log con tipo 'update'.

import { pool } from './db';
import { UpdatePersonInput } from './validators';

export async function updatePerson(numeroDocumento: string, data: UpdatePersonInput) {
  // Construir el SET dinámicamente con solo los campos que llegaron
  const fields = ['tipo_documento','primer_nombre','segundo_nombre','apellidos',
                  'fecha_nacimiento','genero','correo_electronico','celular','foto_url'];

  const setClauses: string[] = [];
  const values: any[] = [];
  let index = 1;

  for (const field of fields) {
    if (data[field as keyof UpdatePersonInput] !== undefined) {
      setClauses.push(`${field} = $${index}`);
      values.push(data[field as keyof UpdatePersonInput]);
      index++;
    }
  }

  // Siempre actualizar updated_at
  setClauses.push(`updated_at = now()`);

  // El numero_documento va al final como condición del WHERE
  values.push(numeroDocumento);

  const result = await pool.query(
    `UPDATE personas SET ${setClauses.join(', ')} WHERE numero_documento = $${index} RETURNING numero_documento`,
    values
  );

  // Si no encontró la persona, lanzar error
  if (result.rowCount === 0) {
    throw new Error('PERSON_NOT_FOUND');
  }

  // Registrar la transacción en el log
  await pool.query(
    `INSERT INTO logs (numero_documento, tipo_transaccion, descripcion, user_id, user_email)
     VALUES ($1, 'update', $2, $3, $4)`,
    [
      numeroDocumento,
      `Persona modificada. Campos actualizados: ${setClauses.slice(0, -1).map(c => c.split(' =')[0]).join(', ')}`,
      data.user_id    ?? null,
      data.user_email ?? null,
    ]
  );
}