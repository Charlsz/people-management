-- Enable pgvector extension for RAG
CREATE EXTENSION IF NOT EXISTS vector;

-- Personas table
CREATE TABLE IF NOT EXISTS personas (
  tipo_documento VARCHAR(30) NOT NULL,
  nro_documento  VARCHAR(10) PRIMARY KEY,
  primer_nombre  VARCHAR(30) NOT NULL,
  segundo_nombre VARCHAR(30),
  apellidos      VARCHAR(60) NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  genero         VARCHAR(20) NOT NULL,
  email          VARCHAR(255) NOT NULL,
  celular        VARCHAR(10) NOT NULL,
  foto_url       TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Logs table
CREATE TABLE IF NOT EXISTS logs (
  id      SERIAL PRIMARY KEY,
  tipo    VARCHAR(20) NOT NULL,
  doc     VARCHAR(10) NOT NULL,
  fecha   TIMESTAMPTZ DEFAULT NOW(),
  detalle TEXT NOT NULL
);

-- Embeddings table for n8n RAG with pgvector
CREATE TABLE IF NOT EXISTS documents (
  id        SERIAL PRIMARY KEY,
  content   TEXT NOT NULL,
  metadata  JSONB DEFAULT '{}',
  embedding VECTOR(1536)
);

-- Index for vector similarity search
CREATE INDEX IF NOT EXISTS documents_embedding_idx
  ON documents USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);
