// Schema de validación con Zod.
// Cada regla corresponde exactamente a las validaciones requeridas en la rúbrica.
// Si los datos no pasan esto, el controller devuelve 400 antes de tocar la BD.

import { z } from 'zod';

export const createPersonSchema = z.object({
  // Solo numérico, máximo 10 caracteres
  numero_documento: z
    .string()
    .regex(/^[0-9]{1,10}$/, 'Debe ser numérico y máximo 10 caracteres'),

  // Solo estos dos valores
  tipo_documento: z.enum(['Tarjeta de identidad', 'Cédula']),

  // Sin números, máximo 30 caracteres
  primer_nombre: z
    .string()
    .regex(/^[^0-9]{1,30}$/, 'No debe contener números, máximo 30 caracteres'),

  // Igual que primer nombre pero opcional
  segundo_nombre: z
    .string()
    .regex(/^[^0-9]{1,30}$/, 'No debe contener números, máximo 30 caracteres')
    .optional(),

  // Sin números, máximo 60 caracteres
  apellidos: z
    .string()
    .regex(/^[^0-9]{1,60}$/, 'No debe contener números, máximo 60 caracteres'),

  // Formato YYYY-MM-DD (lo que devuelve un input type="date")
  fecha_nacimiento: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato debe ser YYYY-MM-DD'),

  // Solo estos cuatro valores
  genero: z.enum(['Masculino', 'Femenino', 'No binario', 'Prefiero no reportar']),

  // Formato de correo válido
  correo_electronico: z.string().email('Formato de correo inválido'),

  // Solo números, exactamente 10 caracteres
  celular: z
    .string()
    .regex(/^[0-9]{10}$/, 'Debe ser numérico y exactamente 10 caracteres'),

  // URL de la foto subida a Supabase Storage (opcional)
  foto_url: z.string().optional(),

  // Datos del usuario autenticado que hace la operación (para el log)
  user_id:    z.string().optional(),
  user_email: z.string().email().optional(),
});

// Tipo inferido del schema, se usa en service.ts para tipar el parámetro
export type CreatePersonInput = z.infer<typeof createPersonSchema>;