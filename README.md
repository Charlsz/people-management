# Trabajo final DS2 

## Arquitectura final

- Frontend Next.js
- Supabase Auth para autenticación con proveedor reconocido
- Supabase Storage para fotos, guardando URL/path
- Docker Compose para levantar frontend, microservicios, n8n y Postgres
- Un contenedor Postgres independiente
- Microservicio crear
- Microservicio modificar
- Microservicio borrar
- Microservicio consultar, separado y apagable
- Microservicio log, con filtros por tipo/documento/fecha
- n8n para lenguaje natural con RAG, registrando pregunta y respuesta en log[^1]