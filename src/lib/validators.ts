import { z } from "zod";

const GENERO_OPTIONS = ["Masculino", "Femenino", "No binario", "Prefiero no decir"] as const;
const TIPO_DOC_OPTIONS = ["Tarjeta de Identidad", "Cédula de Ciudadanía"] as const;

export const personaSchema = z.object({
  tipo_documento: z.enum(TIPO_DOC_OPTIONS, {
    message: "Seleccione un tipo de documento válido",
  }),
  nro_documento: z
    .string()
    .min(1, "El número de documento es requerido")
    .max(10, "Máximo 10 caracteres")
    .regex(/^\d+$/, "Solo se permiten números"),
  primer_nombre: z
    .string()
    .min(1, "El primer nombre es requerido")
    .max(30, "Máximo 30 caracteres"),
  segundo_nombre: z
    .string()
    .max(30, "Máximo 30 caracteres")
    .optional()
    .or(z.literal("")),
  apellidos: z
    .string()
    .min(1, "Los apellidos son requeridos")
    .max(60, "Máximo 60 caracteres"),
  fecha_nacimiento: z
    .string()
    .min(1, "La fecha de nacimiento es requerida"),
  genero: z.enum(GENERO_OPTIONS, {
    message: "Seleccione un género válido",
  }),
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Ingrese un email válido"),
  celular: z
    .string()
    .length(10, "El celular debe tener exactamente 10 dígitos")
    .regex(/^\d{10}$/, "Solo se permiten 10 dígitos numéricos"),
});

export type PersonaFormData = z.infer<typeof personaSchema>;

export { GENERO_OPTIONS, TIPO_DOC_OPTIONS };
