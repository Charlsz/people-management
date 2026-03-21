# Gestion de Datos Personales

Aplicacion CRUD de datos personales con trazabilidad de logs, almacenamiento de fotos y consulta en lenguaje natural con RAG.

## Quick Start

### Requisitos

- Node.js 20+
- npm
- Credenciales de Supabase

### Ejecucion local en menos de 5 minutos

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Aplicacion: http://localhost:3000

### Ejecucion con Docker Compose

```bash
docker compose up -d
```

Aplicacion: http://localhost:3000
n8n: http://localhost:5678

## Features

- CRUD de personas: crear, consultar, modificar y borrar por numero de documento.
- Validaciones de backend para campos personales y foto.
- Registro de transacciones en tabla de logs (CREATE, READ, UPDATE, DELETE).
- Consulta en lenguaje natural integrada con n8n y patron RAG.
- Arquitectura lista para contenedores con servicio de app, servicio de consulta y n8n.

## Configuration

Variables esperadas en `.env`:

| Variable | Descripcion | Default |
|---|---|---|
| DATABASE_URL | Conexion PostgreSQL/Supabase para Prisma | - |
| NEXT_PUBLIC_SUPABASE_URL | URL publica de proyecto Supabase | - |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Llave anon publica de Supabase | - |
| SUPABASE_SERVICE_ROLE_KEY | Llave de servicio para operaciones server | - |
| N8N_WEBHOOK_URL | Webhook para consulta natural/ingesta RAG | - |
| NODE_ENV | Entorno de ejecucion | development |

### Campos y reglas de negocio

| Campo | Regla |
|---|---|
| tipo_documento | Lista: Tarjeta de identidad, Cédula |
| nro_documento | Numerico, maximo 10 caracteres |
| primer_nombre | No numerico, maximo 30 caracteres |
| segundo_nombre | No numerico, maximo 30 caracteres |
| apellidos | No numerico, maximo 60 caracteres |
| fecha_nacimiento | Calendario o texto valido en formato dd-mmm-yyyy |
| genero | Lista: Masculino, femenino, No binario, Prefiero no reportar |
| email | Formato de correo valido |
| celular | Numerico, exactamente 10 caracteres |
| foto | Imagen valida, maximo 2 MB |

## API Reference

### POST /api/personas/create

Crea una persona con validaciones de backend y registra log CREATE.

| Campo | Tipo | Requerido |
|---|---|---|
| tipo_documento | string | Si |
| nro_documento | string | Si |
| primer_nombre | string | Si |
| segundo_nombre | string | No |
| apellidos | string | Si |
| fecha_nacimiento | string | Si |
| genero | string | Si |
| email | string | Si |
| celular | string | Si |
| foto_base64 | string | No |

Respuesta:
- 201: Persona creada
- 400: Error de validacion
- 409: Documento ya existe

### GET /api/personas/[doc]

Consulta persona por numero de documento y registra log READ.

Respuesta:
- 200: Persona encontrada
- 404: Persona no encontrada

### PUT /api/personas/[doc]

Actualiza datos de persona por documento con validaciones de backend y registra log UPDATE.

Respuesta:
- 200: Persona actualizada
- 400: Error de validacion
- 404: Persona no encontrada

### DELETE /api/personas/[doc]

Elimina persona por documento y registra log DELETE.

Respuesta:
- 200: Persona eliminada
- 404: Persona no encontrada

### GET /api/personas/buscar?q=texto

Busca personas por documento, nombre, apellido o email.

### GET /api/logs?tipo=&doc=&desde=&hasta=

Consulta logs por filtros de tipo, documento y fecha.

## Documentation

- [README](README.md)
- [Prisma Schema](prisma/schema.prisma)
- [Database Init SQL](db/init.sql)

## Contributing

1. Crear rama desde `main`.
2. Implementar cambios pequenos y descriptivos.
3. Ejecutar lint y pruebas locales.
4. Abrir Pull Request hacia `main`.
5. Resolver observaciones de revision antes de merge.

## License

Uso academico / interno del equipo del proyecto.
