// Controlador: recibe los filtros como query params y devuelve los logs.

import { Request, Response } from 'express';
import { queryLogs } from './service';

export async function queryLogsController(req: Request, res: Response) {
  const { tipo_transaccion, numero_documento, fecha_desde, fecha_hasta } = req.query as {
    tipo_transaccion?: string;
    numero_documento?: string;
    fecha_desde?: string;
    fecha_hasta?: string;
  };

  // Validar que tipo_transaccion sea uno de los valores permitidos si viene
  const tiposValidos = ['create', 'update', 'delete', 'query', 'rag_question', 'rag_answer'];
  if (tipo_transaccion && !tiposValidos.includes(tipo_transaccion)) {
    return res.status(400).json({ error: 'Tipo de transacción inválido' });
  }

  try {
    const logs = await queryLogs({ tipo_transaccion, numero_documento, fecha_desde, fecha_hasta });
    return res.status(200).json(logs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}