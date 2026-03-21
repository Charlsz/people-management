import { z } from "zod";

const GENERO_OPTIONS = ["Masculino", "femenino", "No binario", "Prefiero no reportar"] as const;
const TIPO_DOC_OPTIONS = ["Tarjeta de identidad", "Cédula"] as const;

const MAX_FOTO_SIZE_BYTES = 2 * 1024 * 1024;

const SPANISH_MONTHS: Record<string, number> = {
  ene: 0,
  feb: 1,
  mar: 2,
  abr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  ago: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dic: 11,
};

const ENGLISH_MONTHS: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

function normalizeToken(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function isSameUtcDate(date: Date, year: number, month: number, day: number) {
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month &&
    date.getUTCDate() === day
  );
}

function parseIsoDate(value: string): Date | null {
  const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!isoMatch) return null;

  const year = Number(isoMatch[1]);
  const month = Number(isoMatch[2]) - 1;
  const day = Number(isoMatch[3]);

  const date = new Date(Date.UTC(year, month, day));
  return isSameUtcDate(date, year, month, day) ? date : null;
}

function parseDdMmmYyyyDate(value: string): Date | null {
  const dmyMatch = value.match(/^(\d{2})-([A-Za-z]{3})-(\d{4})$/);
  if (!dmyMatch) return null;

  const day = Number(dmyMatch[1]);
  const monthToken = normalizeToken(dmyMatch[2]);
  const year = Number(dmyMatch[3]);
  const month = SPANISH_MONTHS[monthToken] ?? ENGLISH_MONTHS[monthToken];

  if (month === undefined) return null;

  const date = new Date(Date.UTC(year, month, day));
  return isSameUtcDate(date, year, month, day) ? date : null;
}

export function parseBirthDate(value: string): Date | null {
  const trimmed = value.trim();
  return parseIsoDate(trimmed) ?? parseDdMmmYyyyDate(trimmed);
}

function isValidBirthDate(value: string): boolean {
  const parsed = parseBirthDate(value);
  if (!parsed) return false;

  const today = new Date();
  const currentUtc = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  return parsed <= currentUtc;
}

function stripDataUrlPrefix(base64: string): string {
  const commaIndex = base64.indexOf(",");
  if (base64.startsWith("data:") && commaIndex >= 0) {
    return base64.slice(commaIndex + 1);
  }
  return base64;
}

function isSupportedImageBuffer(buffer: Buffer): boolean {
  const isJpeg = buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const isPng =
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a;
  const isGif =
    buffer.length >= 6 &&
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38;
  const isWebp =
    buffer.length >= 12 &&
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50;

  return isJpeg || isPng || isGif || isWebp;
}

function inferImageMetadata(buffer: Buffer): { extension: string; contentType: string } | null {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { extension: "jpg", contentType: "image/jpeg" };
  }

  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { extension: "png", contentType: "image/png" };
  }

  if (
    buffer.length >= 6 &&
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38
  ) {
    return { extension: "gif", contentType: "image/gif" };
  }

  if (
    buffer.length >= 12 &&
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return { extension: "webp", contentType: "image/webp" };
  }

  return null;
}

export function validateAndDecodePhoto(base64: string):
  | { ok: true; buffer: Buffer; extension: string; contentType: string }
  | { ok: false; error: string } {
  const normalizedBase64 = stripDataUrlPrefix(base64).replace(/\s+/g, "");

  if (!normalizedBase64) {
    return { ok: false, error: "La foto enviada es inválida" };
  }

  let buffer: Buffer;
  try {
    buffer = Buffer.from(normalizedBase64, "base64");
  } catch {
    return { ok: false, error: "La foto enviada es inválida" };
  }

  if (buffer.length === 0) {
    return { ok: false, error: "La foto enviada es inválida" };
  }

  if (buffer.length > MAX_FOTO_SIZE_BYTES) {
    return { ok: false, error: "La foto no debe superar los 2 MB" };
  }

  if (!isSupportedImageBuffer(buffer)) {
    return { ok: false, error: "La foto debe ser un archivo de imagen válido" };
  }

  const metadata = inferImageMetadata(buffer);
  if (!metadata) {
    return { ok: false, error: "Formato de imagen no soportado" };
  }

  return {
    ok: true,
    buffer,
    extension: metadata.extension,
    contentType: metadata.contentType,
  };
}

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
    .trim()
    .min(1, "El primer nombre es requerido")
    .max(30, "Máximo 30 caracteres")
    .regex(/^(?!.*\d).+$/, "El primer nombre no puede contener números"),
  segundo_nombre: z
    .string()
    .trim()
    .max(30, "Máximo 30 caracteres")
    .regex(/^(?!.*\d).+$/, "El segundo nombre no puede contener números")
    .optional()
    .or(z.literal("")),
  apellidos: z
    .string()
    .trim()
    .min(1, "Los apellidos son requeridos")
    .max(60, "Máximo 60 caracteres")
    .regex(/^(?!.*\d).+$/, "Los apellidos no pueden contener números"),
  fecha_nacimiento: z
    .string()
    .min(1, "La fecha de nacimiento es requerida")
    .refine(
      (value) => isValidBirthDate(value),
      "La fecha debe ser válida (YYYY-MM-DD o DD-MMM-YYYY) y no futura"
    ),
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
