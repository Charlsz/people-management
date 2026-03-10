# Gestión de Datos Personales

Sistema CRUD completo para gestión de datos personales con consulta por lenguaje natural (RAG).

## Stack Tecnológico

| Tecnología | Uso |
|---|---|
| **Next.js** | App Router, React Compiler, Server Components |
| **React** | UI con react-hook-form + Zod validations |
| **Supabase** | Auth (Email Magic Link), Postgres, Storage (fotos) |
| **Prisma** | ORM para modelos Persona y Log |
| **Docker Compose** | 3 servicios: app, consultar, n8n |
| **n8n** | Workflow RAG con Supabase pgvector |
| **Tailwind CSS** | Estilos |

## Inicio Rápido

### 1. Clonar el repositorio

```bash
git clone https://github.com/Charlsz/people-management.git
cd people-management
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
# Abrir .env y completar con las credenciales de Supabase y n8n
```

### 3. Desarrollo local (sin Docker)

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

### 4. Con Docker Compose

```bash
docker compose up -d
```

Acceder a:
- **App**: http://localhost:3000
- **n8n**: http://localhost:5678 (usuario: `admin` / contraseña: `admin`)

### 5. Escalar servicio consultar

```bash
docker compose up -d --scale consultar=2
```

## Servicios Docker

| Servicio | Puerto | Descripción |
|---|---|---|
| `app` | 3000 | Next.js principal |
| `consultar` | - | Réplica escalable (replicas: 0) |
| `n8n` | 5678 | Motor de workflows RAG |

## Campos de Persona

| Campo | Tipo | Restricción |
|---|---|---|
| tipo_documento | Enum | "Tarjeta de Identidad" / "Cédula de Ciudadanía" |
| nro_documento | String | PK, máx 10 dígitos numéricos |
| primer_nombre | String | Requerido, máx 30 chars |
| segundo_nombre | String | Opcional, máx 30 chars |
| apellidos | String | Requerido, máx 60 chars |
| fecha_nacimiento | Date | Formato dd-mmm-yyyy |
| genero | Enum | Masculino / Femenino / No binario / Prefiero no decir |
| email | String | Validación de formato email |
| celular | String | Exactamente 10 dígitos |
| foto | File | Máximo 2MB, almacenada en Supabase Storage |

## Logs

Toda transacción (CREATE, READ, UPDATE, DELETE) queda registrada en la tabla `logs` con:
- **tipo**: Tipo de operación
- **doc**: Número de documento involucrado
- **fecha**: Timestamp automático
- **detalle**: Descripción de la operación

## n8n - Workflow RAG

1. Acceder a n8n en http://localhost:5678
2. Crear un workflow con:
   - **Webhook Trigger** (POST `/webhook/chat`)
   - **Supabase Vector Store** (pgvector embeddings)
   - **OpenAI Chat** (o modelo LLM de preferencia)
   - **Respond to Webhook** (devolver respuesta)
3. La tabla `documents` en PostgreSQL almacena embeddings con `vector(1536)`

---

## Estrategia de Ramas (Git Branching)

El código base en `main` contiene el esqueleto funcional completo (CRUD básico, validaciones Zod, API routes, Docker, estructura). Cada integrante trabaja en su rama e implementa las mejoras asignadas. Al finalizar, cada uno hace **Pull Request a `main`** y se acepta tras revisión.

```
master  ← rama principal (esqueleto funcional, NO tocar directamente)
 ├── feature/frontend-ux     →   (UI/UX)
 ├── feature/backend-api     →   (API + Auth)
 ├── feature/devops-docker   →   (Docker + CI/CD)
 └── feature/rag-n8n         →   (n8n + RAG)
```

Cada integrante trabaja **solo en su rama**. Para empezar:

```bash
# Clonar y pararse en la rama asignada (ejemplo para Carlos)
git clone https://github.com/Charlsz/people-management.git
cd people-management
git checkout feature/frontend-ux
```

---

### Rama `feature/frontend-ux` — Frontend / UX

**Archivos principales a tocar:**
- `src/app/page.tsx`
- `src/app/personas/*/page.tsx`
- `src/app/logs/page.tsx`
- `src/app/login/page.tsx`
- `src/app/globals.css`
- `src/components/layout/Navbar.tsx`
- `src/components/personas/PersonaForm.tsx`
- `src/components/ui/` (nuevos componentes)

**Tareas:**
- [ ] Mejorar diseño visual y UX de todas las páginas (colores, espaciado, tipografía)
- [ ] Asegurar responsividad completa (mobile, tablet, desktop)
- [ ] Agregar componente `<Toast />` para notificaciones de éxito/error en todo el CRUD
- [ ] Agregar estados de carga (loading skeletons / spinners) en búsquedas y envíos de formulario
- [ ] Agregar estados vacíos informativos (cuando no hay resultados, cuando no hay logs)
- [ ] Implementar toggle de dark mode funcional (persistir preferencia en localStorage)
- [ ] Mostrar preview de foto actual al consultar/modificar una persona
- [ ] Agregar confirmación visual animada después de crear/modificar/borrar exitosamente
- [ ] Mejorar el Navbar: menú hamburguesa en mobile, indicar página activa con estilo

**Criterios de aceptación del PR:**
> Todas las páginas se ven bien en mobile (375px) y desktop (1440px). Los formularios muestran feedback claro al usuario. No hay textos cortados ni overflow.

---

### Rama `feature/backend-api` — API / Backend / Auth

**Archivos principales a tocar:**
- `src/app/api/personas/create/route.ts`
- `src/app/api/personas/[doc]/route.ts`
- `src/app/api/personas/buscar/route.ts`
- `src/app/api/logs/route.ts`
- `src/lib/supabase.ts`
- `src/lib/prisma.ts`
- `src/middleware.ts` (nuevo)

**Tareas:**
- [ ] Implementar middleware de autenticación con Supabase Auth (proteger rutas API y páginas)
- [ ] Validar sesión activa en cada endpoint API: si no hay token válido, responder 401
- [ ] Agregar middleware de Next.js (`src/middleware.ts`) para redirigir usuarios no autenticados a `/login`
- [ ] Implementar paginación real en `/api/personas/buscar` (query params `page` y `limit`)
- [ ] Implementar paginación en `/api/logs` (query params `page` y `limit`)
- [ ] Agregar endpoint `GET /api/personas/stats` (total personas, personas por género, por tipo doc)
- [ ] Mejorar manejo de errores: respuestas consistentes con códigos HTTP correctos
- [ ] Agregar log de tipo `"LOGIN"` cuando un usuario inicia sesión exitosamente
- [ ] Validar que la foto subida sea realmente una imagen (verificar Content-Type del buffer)

**Criterios de aceptación del PR:**
> Ninguna ruta API funciona sin autenticación. Páginas redirigen a login si no hay sesión. Paginación funciona con `?page=1&limit=10`. Logs registran logins.

---

### Rama `feature/devops-docker` — Docker / DevOps / CI-CD

**Archivos principales a tocar:**
- `docker-compose.yml`
- `Dockerfile`
- `.github/workflows/ci.yml` (nuevo)
- `.github/workflows/deploy.yml` (nuevo)
- `db/init.sql`
- `.env.example`

**Tareas:**
- [ ] Verificar `docker-compose.yml` apunta correctamente a Supabase cloud (solo `app`, `consultar`, `n8n`)
- [ ] Optimizar Dockerfile con multi-stage build real (stage `deps`, stage `builder`, stage `runner` con `node:20-alpine`)
- [ ] Crear GitHub Actions workflow `ci.yml`: lint + type-check + build en cada push/PR
- [ ] Crear GitHub Actions workflow `deploy.yml`: build image + push a registry + deploy (manual trigger)
- [ ] Agregar healthcheck a servicio `app` en docker-compose (`/api/health` endpoint)
- [ ] Crear endpoint `GET /api/health` que retorne `{ status: "ok", timestamp }` (para healthchecks)
- [ ] Configurar `.env.example` con documentación clara de cada variable
- [ ] Agregar script `prisma db push` al entrypoint del Dockerfile para auto-migrar al iniciar

**Criterios de aceptación del PR:**
> `docker compose up -d` levanta app + n8n apuntando a Supabase cloud (sin DB ni auth locales). CI pasa lint + build. Dockerfile optimizado pesa menos de 200MB.

---

### Rama `feature/rag-n8n` — n8n / RAG / Consulta Natural

**Archivos principales a tocar:**
- `src/app/consultar-natural/page.tsx`
- `src/app/api/personas/create/route.ts` (agregar trigger de embedding)
- `src/app/api/personas/[doc]/route.ts` (agregar trigger de embedding)
- `db/init.sql`
- `n8n/` (nueva carpeta con exports de workflows)

**Tareas:**
- [ ] Diseñar y construir workflow RAG completo en n8n con nodos: Webhook → Embeddings → Vector Search → LLM → Response
- [ ] Configurar Supabase como Vector Store en n8n (conectar a tabla `documents` con pgvector)
- [ ] Crear workflow de ingesta: cuando se crea/modifica persona, un webhook de n8n genera embedding del texto de la persona y lo guarda en `documents`
- [ ] Agregar llamada `fetch` al webhook de ingesta en las rutas API `create` y `PUT [doc]` (después del log)
- [ ] Configurar modelo LLM en n8n (OpenAI API key o Ollama local)
- [ ] Mejorar la UI del chat: mostrar fuentes/referencias de dónde viene la respuesta
- [ ] Exportar los workflows de n8n como JSON y guardarlos en `n8n/workflows/` para versionamiento
- [ ] Crear `n8n/README.md` con instrucciones paso a paso para importar los workflows
- [ ] Probar al menos 10 consultas en lenguaje natural y documentar resultados

**Criterios de aceptación del PR:**
> Se puede preguntar "¿Cuántas personas con cédula hay registradas?" y recibir respuesta correcta. Los workflows están exportados como JSON y se pueden importar en un n8n limpio. La ingesta se activa automáticamente al crear/modificar persona.

---

## Flujo de Trabajo del Equipo

1. Cada integrante hace `git checkout <su-rama>` y trabaja ahí
2. Commits frecuentes con mensajes descriptivos: `feat: agregar middleware auth`, `fix: paginación logs`
3. Al terminar, abrir **Pull Request** de `<su-rama>` → `main`
4. Otro integrante revisa el PR (code review)
5. Resolver conflictos si los hay (especialmente en archivos compartidos como `route.ts`)
6. Merge a `main` cuando el PR esté aprobado
7. Orden recomendado de merge: `feature/backend-api` → `feature/frontend-ux` → `feature/devops-docker` → `feature/rag-n8n`
