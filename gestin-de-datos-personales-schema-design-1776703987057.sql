--
-- Esquema PostgreSQL para "Gestión de Datos Personales"
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', 'public', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';
SET default_table_access_method = heap;

--
-- Tabla: personas
-- Guarda los datos principales del formulario
--

CREATE TABLE public.personas (
    numero_documento text NOT NULL,
    tipo_documento text NOT NULL,
    primer_nombre text NOT NULL,
    segundo_nombre text,
    apellidos text NOT NULL,
    fecha_nacimiento date NOT NULL,
    genero text NOT NULL,
    correo_electronico text NOT NULL,
    celular text NOT NULL,
    foto_url text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,

    CONSTRAINT personas_pkey PRIMARY KEY (numero_documento),

    CONSTRAINT personas_tipo_documento_check
        CHECK (tipo_documento = ANY (ARRAY[
            'Tarjeta de identidad'::text,
            'Cédula'::text
        ])),

    CONSTRAINT personas_numero_documento_check
        CHECK (numero_documento ~ '^[0-9]{1,10}$'),

    CONSTRAINT personas_primer_nombre_check
        CHECK (primer_nombre ~ '^[^0-9]{1,30}$'),

    CONSTRAINT personas_segundo_nombre_check
        CHECK (segundo_nombre IS NULL OR segundo_nombre ~ '^[^0-9]{1,30}$'),

    CONSTRAINT personas_apellidos_check
        CHECK (apellidos ~ '^[^0-9]{1,60}$'),

    CONSTRAINT personas_genero_check
        CHECK (genero = ANY (ARRAY[
            'Masculino'::text,
            'Femenino'::text,
            'No binario'::text,
            'Prefiero no reportar'::text
        ])),

    CONSTRAINT personas_correo_electronico_check
        CHECK (correo_electronico ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),

    CONSTRAINT personas_celular_check
        CHECK (celular ~ '^[0-9]{10}$')
);

--
-- Tabla: logs
-- Guarda todas las transacciones del sistema
-- Incluye CRUD y también preguntas/respuestas del RAG
--

CREATE TABLE public.logs (
    id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
    numero_documento text,
    tipo_transaccion text NOT NULL,
    descripcion text,
    user_id text,
    user_email text,
    fecha_transaccion timestamp with time zone DEFAULT now() NOT NULL,

    CONSTRAINT logs_pkey PRIMARY KEY (id),

    CONSTRAINT logs_tipo_transaccion_check
        CHECK (tipo_transaccion = ANY (ARRAY[
            'create'::text,
            'update'::text,
            'delete'::text,
            'query'::text,
            'rag_question'::text,
            'rag_answer'::text
        ])),

    CONSTRAINT logs_user_email_check
        CHECK (
            user_email IS NULL OR
            user_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
        ),

    CONSTRAINT logs_numero_documento_fkey
        FOREIGN KEY (numero_documento)
        REFERENCES public.personas(numero_documento)
);

--
-- Índices para búsqueda de logs
-- Requisito: búsqueda por tipo, documento y fecha
--

CREATE INDEX idx_logs_tipo_transaccion
    ON public.logs USING btree (tipo_transaccion);

CREATE INDEX idx_logs_numero_documento
    ON public.logs USING btree (numero_documento);

CREATE INDEX idx_logs_fecha_transaccion
    ON public.logs USING btree (fecha_transaccion);

--
-- Índice opcional para consultas rápidas por correo
-- Útil, pero sigue siendo simple
--

CREATE INDEX idx_personas_correo_electronico
    ON public.personas USING btree (correo_electronico);

--
-- Comentarios útiles
--

COMMENT ON TABLE public.personas IS 'Tabla principal de personas registradas en el sistema.';
COMMENT ON TABLE public.logs IS 'Tabla de auditoría para registrar CRUD, consultas y eventos de RAG.';
COMMENT ON COLUMN public.personas.foto_url IS 'Ruta o URL de la foto almacenada en Supabase Storage.';
COMMENT ON COLUMN public.logs.numero_documento IS 'Puede ser NULL para eventos RAG generales no asociados a una persona específica.';