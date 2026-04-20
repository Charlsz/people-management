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


## Por qué

### Frontend Next.js

Permite hacer la interfaz rápido, manejar formularios fácilmente y conectar todo desde un solo frontend sin complicarse demasiado.
Además, como el proyecto tiene CRUD y varias opciones de menú, Next.js ayuda a organizar pantallas y formularios de manera limpia.

### Supabase Auth para autenticación con proveedor reconocido

Porque la rúbrica pide usar un sistema de autenticación reconocido, y Supabase Auth deja hacerlo sin montar algo más pesado como un sistema empresarial completo.
Así se cumple el requisito de autenticación de forma simple.

### Supabase Storage para fotos, guardando URL/path

Porque la foto no hace falta guardarla dentro de PostgreSQL; es más simple subirla a Storage y guardar solo la ruta o URL en la base de datos.
También te sirve bien para validar que el archivo no supere 2 MB antes de subirlo.

### Docker Compose para levantar frontend, microservicios, n8n y Postgres

Porque la rúbrica pide que la aplicación se despliegue en contenedores, y Docker Compose es la forma más sencilla de levantar varios servicios al mismo tiempo.
Frontend, tus servicios, n8n y la base de datos corren separados.

### Un contenedor Postgres independiente

Porque el enunciado dice explícitamente que la base de datos debe estar en un contenedor independiente al resto de la aplicación.
Además, usar un solo Postgres te mantiene el proyecto simple.

### Microservicio crear

Porque “Crear Personas” aparece como una opción del menú, y la rúbrica dice que cada opción del menú debe desarrollarse en un microservicio.
Este servicio se encarga de registrar nuevos datos personales y de dejar trazabilidad en el log.

### Microservicio modificar

Porque “Modificar Datos Personales” también aparece como una opción del menú y debe vivir como su propio microservicio para cumplir literalmente ese punto.
Aquí haces las validaciones, actualizas la información y registras la transacción en el log.

### Microservicio borrar

Porque “Borrar Personas” es otra opción del menú y debe estar separada si quieres cumplir la rúbrica de la forma más segura posible.
También debe guardar en log quién borró, qué documento se borró y cuándo se hizo.

### Microservicio consultar, separado y apagable

Porque la rúbrica dice dos cosas muy claras: que “Consultar” debe estar en un contenedor independiente y que se debe poder habilitar y deshabilitar según demanda.
Por eso este servicio no conviene mezclarlo con los demás; debe poder levantarse o apagarse sin afectar toda la aplicación.

### Microservicio log, con filtros por tipo/documento/fecha

Porque no solo se debe registrar transacciones, sino también poder consultarlas por tipo y documento, y por fecha de transacción.
Este servicio ayuda a cumplir exactamente ese punto sin mezclar la lógica de auditoría con el CRUD principal.

### n8n para lenguaje natural con RAG, registrando pregunta y respuesta en log

Porque la rúbrica pide consulta en lenguaje natural usando n8n y aplicando RAG, y además aclara que las preguntas y respuestas también deben quedar registradas en el log.