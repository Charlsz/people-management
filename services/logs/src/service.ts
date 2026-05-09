// Lógica para consultar el log de transacciones.
// Permite filtrar por tipo_transaccion, numero_documento y fecha.
// Todos los filtros son opcionales y se combinan entre sí.

import { pool } from './db';

interface LogFilters {
  tipo_transaccion?: string;
  numero_documento?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
}

export async function queryLogs(filters: LogFilters) {
  // Construir el WHERE dinámicamente según los filtros que lleguen
  const conditions: string[] = [];
  const values: any[] = [];
  let index = 1;

  if (filters.tipo_transaccion) {
    conditions.push(`tipo_transaccion = $${index}`);
    values.push(filters.tipo_transaccion);
    index++;
  }

  if (filters.numero_documento) {
    conditions.push(`numero_documento = $${index}`);
    values.push(filters.numero_documento);
    index++;
  }

  if (filters.fecha_desde) {
    conditions.push(`fecha_transaccion >= $${index}`);
    values.push(filters.fecha_desde);
    index++;
  }

  if (filters.fecha_hasta) {
    conditions.push(`fecha_transaccion <= $${index}`);
    values.push(filters.fecha_hasta);
    index++;
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const result = await pool.query(
    `SELECT id, numero_documento, tipo_transaccion, descripcion, user_id, user_email, fecha_transaccion
     FROM logs
     ${where}
     ORDER BY fecha_transaccion DESC`,
    values
  );

  return result.rows;
}