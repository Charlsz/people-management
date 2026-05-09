## frontend
Aquí va nuestra aplicación Next.js, que será la interfaz principal para login, formularios, menú y vistas de consulta.

Debe consumir los microservicios y conectarse con Supabase Auth y Supabase Storage, pero no contener la lógica principal del CRUD ni del log.

Next.js 16 + Tailwind CSS + Supabase Auth + Supabase Storage

## Requisitos previos

- Node.js 20+
- Los 5 microservicios corriendo localmente (puertos 3001–3005)
- Proyecto de Supabase configurado

## Variables de entorno

Crear archivo `frontend/.env.local` con:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbg...tu-anon-key
```

## Instalación

```bash
npm install
npm run dev
```

## Estructura de lib/

| Archivo | Descripción |
|---|---|
| `lib/supabase.ts` | Cliente de Supabase, importar desde aquí |
| `lib/auth.ts` | `signIn`, `signOut`, `getSession`, `getUser` |
| `lib/storage.ts` | `uploadFoto`, `deleteFoto` para el bucket `fotos-personas` |
| `lib/api.ts` | (vacío) Aquí van las llamadas a los microservicios |
| `lib/validations.ts` | (vacío) Aquí van las validaciones de formularios |

## Páginas a implementar

| Ruta | Descripción |
|---|---|
| `/login` | Login con email/password usando `signIn()` de `lib/auth.ts` |
| `/dashboard` | Menú principal, requiere sesión activa |
| `/crear` | Formulario + subida de foto con `uploadFoto()` → POST a `localhost:3001` |
| `/modificar` | Búsqueda por documento → PUT a `localhost:3002` |
| `/consultar` | Búsqueda por documento → GET a `localhost:3004` |
| `/borrar` | Búsqueda + confirmación → DELETE a `localhost:3003` + `deleteFoto()` |
| `/logs` | Tabla con filtros → GET a `localhost:3005` |

## Microservicios

| Servicio | Puerto | Método | Endpoint |
|---|---|---|---|
| create-person | 3001 | POST | `/api/personas` |
| update-person | 3002 | PUT | `/api/personas/:documento` |
| delete-person | 3003 | DELETE | `/api/personas/:documento` |
| query-person | 3004 | GET | `/api/personas/:documento` |
| logs | 3005 | GET | `/api/logs` |

## Flujo de autenticación

Todas las páginas excepto `/login` deben verificar sesión activa con `getSession()` de `lib/auth.ts`. Si no hay sesión, redirigir a `/login`.