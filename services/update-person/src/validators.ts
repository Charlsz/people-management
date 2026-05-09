// Validaciones para modificar una persona.
// El numero_documento llega por params en la URL, no en el body.
// Todos los campos del body son opcionales, pero al menos uno debe venir.

import { z } from 'zod';

export const updatePersonSchema = z.object({
  // No se puede cambiar el tipo de documento
  tipo_documento: z.enum(['Tarjeta de identidad', 'Cédula']).optional(),

  primer_nombre: z
    .string()
    .regex(/^[^0-9]{1,30}$/, 'No debe contener números, máximo 30 caracteres')
    .optional(),

  segundo_nombre: z
    .string()
    .regex(/^[^0-9]{1,30}$/, 'No debe contener números, máximo 30 caracteres')
    .optional(),

  apellidos: z
    .string()
    .regex(/^[^0-9]{1,60}$/, 'No debe contener números, máximo 60 caracteres')
    .optional(),

  fecha_nacimiento: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato debe ser YYYY-MM-DD')
    .optional(),

  genero: z.enum(['Masculino', 'Femenino', 'No binario', 'Prefiero no reportar']).optional(),

  correo_electronico: z.string().email('Formato de correo inválido').optional(),

  celular: z
    .string()
    .regex(/^[0-9]{10}$/, 'Debe ser numérico y exactamente 10 caracteres')
    .optional(),

  foto_url: z.string().optional(),

  // Datos del usuario autenticado para el log
  user_id:    z.string().optional(),
  user_email: z.string().email().optional(),
}).refine(
  // Verifica que al menos un campo editable viene en el body
  (data) => {
    const editables = ['tipo_documento','primer_nombre','segundo_nombre','apellidos',
                       'fecha_nacimiento','genero','correo_electronico','celular','foto_url'];
    return editables.some((key) => data[key as keyof typeof data] !== undefined);
  },
  { message: 'Debe enviar al menos un campo para actualizar' }
);

export type UpdatePersonInput = z.infer<typeof updatePersonSchema>;