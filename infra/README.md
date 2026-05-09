# Infra

Esta carpeta orquesta todos los contenedores del proyecto con Docker Compose.

## Archivos

| Archivo | Descripción |
|---|---|
| `docker-compose.yml` | Levanta los 8 contenedores juntos |
| `.env.example` | Variables de entorno requeridas (copiar como `.env`) |
| `postgres/init.sql` | Script SQL que inicializa las tablas automáticamente al primer arranque |

## Requisitos previos

- Docker Desktop instalado y corriendo
- Proyecto de Supabase configurado con las tablas `personas` y `logs`
- Credenciales del pooler de Supabase disponibles

## Cómo levantar todo

```bash
# 1. Copiar el archivo de variables
cp .env.example .env

# 2. Llenar los valores reales en .env

# 3. Levantar todos los contenedores
docker compose up --build

# 4. Para detener
docker compose down
```

## Contenedores a definir en docker-compose.yml

| Servicio | Puerto | Imagen |
|---|---|---|
| `create-person` | 3001 | build desde `../services/create-person` |
| `update-person` | 3002 | build desde `../services/update-person` |
| `delete-person` | 3003 | build desde `../services/delete-person` |
| `query-person` | 3004 | build desde `../services/query-person` |
| `logs` | 3005 | build desde `../services/logs` |
| `frontend` | 3000 | build desde `../frontend` |
| `n8n` | 5678 (ejemplo hasta que la persona que implemente n8n diga que puerto va a usar. 5678 deberia ser el estandar usado) | `n8nio/n8n` |

## Variables requeridas en .env

```env
# Microservicios — cada uno usa su puerto correspondiente
# Los puertos se mapean en docker-compose.yml, no aquí
DB_HOST=host_del_pooler_de_supabase
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres.id_del_proyecto
DB_PASSWORD=password_de_supabase

# Frontend
NEXT_PUBLIC_SUPABASE_URL=https://id_del_proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...tu-anon-key

# n8n
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=tu_password
```

## Orden de arranque

Como la base de datos es Supabase cloud, no hay dependencia de un contenedor de Postgres. Todos los servicios pueden arrancar en paralelo. El `docker-compose.yml` solo necesita asegurarse de que los microservicios tengan las variables de entorno correctas para conectarse al pooler.

## Nota sobre puertos

Los puertos de cada contenedor se mapean en el `docker-compose.yml` con el formato `"puerto_host:puerto_contenedor"`. No se configuran en el `.env`.