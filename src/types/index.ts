export interface Persona {
  tipo_documento: string;
  nro_documento: string;
  primer_nombre: string;
  segundo_nombre?: string | null;
  apellidos: string;
  fecha_nacimiento: string;
  genero: string;
  email: string;
  celular: string;
  foto_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Log {
  id: number;
  tipo: string;
  doc: string;
  fecha: string;
  detalle: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
