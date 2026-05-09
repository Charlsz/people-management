-- Esquema PostgreSQL para "Gestión de Datos Personales"

SET client_encoding = 'UTF8';
SELECT pg_catalog.set_config('search_path', 'public', false);

-- ============================
-- Tabla: personas
-- Almacena los datos del formulario principal
-- ============================

CREATE TABLE public.personas (
    numero_documento     text NOT NULL,
    tipo_documento       text NOT NULL,
    primer_nombre        text NOT NULL,
    segundo_nombre       text,
    apellidos            text NOT NULL,
    fecha_nacimiento     date NOT NULL,
    genero               text NOT NULL,
    correo_electronico   text NOT NULL,
    celular              text NOT NULL,
    foto_url             text,
    created_at           timestamp without time zone DEFAULT now() NOT NULL,
    updated_at           timestamp without time zone DEFAULT now() NOT NULL,

    CONSTRAINT personas_pkey PRIMARY KEY (numero_documento),

    -- Tipo de documento: solo estos dos valores permitidos
    CONSTRAINT personas_tipo_documento_check
        CHECK (tipo_documento = ANY (ARRAY['Tarjeta de identidad'::text, 'Cédula'::text])),

    -- Documento: solo números, máximo 10 caracteres
    CONSTRAINT personas_numero_documento_check
        CHECK (numero_documento ~ '^[0-9]{1,10}$'),

    -- Primer nombre: sin números, máximo 30 caracteres
    CONSTRAINT personas_primer_nombre_check
        CHECK (primer_nombre ~ '^[^0-9]{1,30}$'),

    -- Segundo nombre: opcional, sin números, máximo 30 caracteres
    CONSTRAINT personas_segundo_nombre_check
        CHECK (segundo_nombre IS NULL OR segundo_nombre ~ '^[^0-9]{1,30}$'),

    -- Apellidos: sin números, máximo 60 caracteres
    CONSTRAINT personas_apellidos_check
        CHECK (apellidos ~ '^[^0-9]{1,60}$'),

    -- Género: solo estos cuatro valores
    CONSTRAINT personas_genero_check
        CHECK (genero = ANY (ARRAY[
            'Masculino'::text, 'Femenino'::text,
            'No binario'::text, 'Prefiero no reportar'::text
        ])),

    -- Correo: formato básico de email
    CONSTRAINT personas_correo_electronico_check
        CHECK (correo_electronico ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),

    -- Celular: solo números, exactamente 10 caracteres
    CONSTRAINT personas_celular_check
        CHECK (celular ~ '^[0-9]{10}$')
);

-- ============================
-- Tabla: logs
-- Registra todas las operaciones del sistema
-- numero_documento es texto libre, no FK,
-- para conservar el historial aunque se borre la persona
-- ============================

CREATE TABLE public.logs (
    id                  bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
    numero_documento    text,
    tipo_transaccion    text NOT NULL,
    descripcion         text,
    user_id             text,
    user_email          text,
    fecha_transaccion   timestamp with time zone DEFAULT now() NOT NULL,

    CONSTRAINT logs_pkey PRIMARY KEY (id),

    -- Solo estos tipos de transacción son válidos
    CONSTRAINT logs_tipo_transaccion_check
        CHECK (tipo_transaccion = ANY (ARRAY[
            'create'::text, 'update'::text, 'delete'::text,
            'query'::text, 'rag_question'::text, 'rag_answer'::text
        ])),

    -- Correo del usuario: opcional, pero si viene debe tener formato válido
    CONSTRAINT logs_user_email_check
        CHECK (
            user_email IS NULL OR
            user_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
        )
);

-- Índices para que las búsquedas de logs sean rápidas
-- (requerimiento: buscar por tipo, documento y fecha)
CREATE INDEX idx_logs_tipo_transaccion  ON public.logs USING btree (tipo_transaccion);
CREATE INDEX idx_logs_numero_documento  ON public.logs USING btree (numero_documento);
CREATE INDEX idx_logs_fecha_transaccion ON public.logs USING btree (fecha_transaccion);

-- Índice útil para búsquedas por correo en personas
CREATE INDEX idx_personas_correo ON public.personas USING btree (correo_electronico);

COMMENT ON TABLE public.personas IS 'Personas registradas en el sistema.';
COMMENT ON TABLE public.logs IS 'Auditoría de todas las operaciones CRUD y RAG.';
COMMENT ON COLUMN public.logs.numero_documento IS 'Referencia informativa. No es FK para conservar historial tras eliminaciones.';