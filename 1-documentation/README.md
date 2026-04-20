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
- n8n para lenguaje natural con RAG, registrando pregunta y respuesta en log

## Plan de organización y desarrollo

La idea es construir la aplicación por partes, empezando por lo más importante: base de datos, autenticación, microservicios, frontend e integración con n8n.  
Así evitamos hacer overengineering y aseguramos cumplir la rúbrica con una solución simple, ordenada y funcional.

### 1. Frontend

El frontend debe encargarse de mostrar la interfaz principal de la aplicación y conectar con los microservicios.  
Los requerimientos mínimos son:

- Pantalla de login con Supabase Auth.
- Menú principal con estas opciones:
  - Crear Personas
  - Modificar Datos Personales
  - Consultar Datos Personales
  - Consultar Datos Personales - Lenguaje Natural en n8n
  - Borrar Personas
  - Consultar Log
- Formularios para crear y modificar personas.
- Vista para consultar una persona por número de documento.
- Vista para borrar una persona por número de documento.
- Vista para consultar logs por tipo, documento y fecha.
- Acceso a la interfaz de n8n para la consulta en lenguaje natural.
- Mensajes de error y éxito claros.
- Validaciones visuales en los formularios.

El frontend no debe contener toda la lógica de negocio.  
Solo debe enviar y recibir datos de los microservicios.

### 2. Validaciones del formulario

Las validaciones deben aplicarse en frontend y backend para no depender solo del navegador.  
Los campos requeridos son:

- Tipo de documento: lista con dos valores:
  - Tarjeta de identidad
  - Cédula
- Nro. Documento: solo números y máximo 10 caracteres.
- Primer Nombre: no debe ser número y máximo 30 caracteres.
- Segundo Nombre: no debe ser número y máximo 30 caracteres.
- Apellidos: no debe ser número y máximo 60 caracteres.
- Fecha de Nacimiento: selector de fecha o entrada en formato dd-mmm-yyyy.
- Género: lista con cuatro valores:
  - Masculino
  - Femenino
  - No binario
  - Prefiero no reportar
- Correo electrónico: formato válido.
- Celular: solo números y exactamente 10 caracteres.
- Foto: tamaño máximo 2 MB.

### 3. Base de datos

<img src="1-documentation/tablasdb.png" alt="tablas">

La base de datos debe ser simple y estar en un solo contenedor PostgreSQL independiente.  
No necesitamos varias bases ni tablas extras innecesarias.

#### tablas mínimas son:
#### -personas
Guarda la información principal de cada persona.

Campos sugeridos:
- numero_documento
- tipo_documento
- primer_nombre
- segundo_nombre
- apellidos
- fecha_nacimiento
- genero
- correo_electronico
- celular
- foto_url
- created_at
- updated_at

Reglas importantes:
- numero_documento debe ser la llave principal.
- Debe ser único.
- Debe permitir búsqueda rápida por documento.

#### -logs
Guarda todas las transacciones del sistema.

Campos sugeridos:
- id
- numero_documento
- tipo_transaccion
- descripcion
- user_id
- user_email
- fecha_transaccion

Reglas importantes:
- Debe registrar acciones de crear, modificar, borrar, consultar, rag_question y rag_answer.
- Debe permitir búsqueda por tipo, documento y fecha.
- Debe registrar también las preguntas y respuestas de n8n.

### 4. Autenticación

La autenticación debe hacerse con Supabase Auth.  
Esto cumple con el requisito de usar un proveedor reconocido (SSO).

Lo mínimo que debes tener es:

- Inicio de sesión funcional.
- Protección de rutas privadas.
- Usuario autenticado disponible para registrar trazabilidad en los logs.

No necesitas guardar contraseñas en tu base de datos local.

### 5. Fotos

Las fotos se almacenan en Supabase Storage.  
En la base de datos solo guardamos la URL o el path del archivo.

Lo mínimo que debes tener es:

- Selección de archivo en el frontend.
- Validación de tamaño máximo 2 MB.
- Subida a Supabase Storage.
- Guardado de la URL en la tabla personas.

Si la foto falla al subir, no debes dejar el registro incompleto.

### 6. Microservicio crear

Este microservicio debe encargarse de registrar una persona nueva.

Debe hacer lo siguiente:
- Recibir los datos del formulario.
- Validar los datos.
- Insertar el registro en la tabla personas.
- Guardar un log con tipo_transaccion = create.

### 7. Microservicio modificar

Este microservicio debe actualizar una persona existente.

Debe hacer lo siguiente:
- Buscar por numero_documento.
- Validar los nuevos datos.
- Actualizar el registro.
- Guardar un log con tipo_transaccion = update.

### 8. Microservicio borrar

Este microservicio debe eliminar una persona por número de documento.

Debe hacer lo siguiente:
- Buscar el registro por numero_documento.
- Eliminarlo si existe.
- Guardar un log con tipo_transaccion = delete.

### 9. Microservicio consultar

Este microservicio debe estar separado en su propio contenedor y poder apagarse o encenderse según demanda.

Debe hacer lo siguiente:
- Consultar una persona por numero_documento.
- Devolver los datos al frontend.
- Guardar un log con tipo_transaccion = query.

Este servicio debe estar aislado del resto de la aplicación.

### 10. Microservicio log

Este microservicio sirve para consultar la auditoría del sistema.

Debe permitir:
- Buscar por tipo_transaccion.
- Buscar por numero_documento.
- Buscar por fecha_transaccion.

También debe mostrar:
- Acciones CRUD.
- Consultas.
- Preguntas y respuestas de n8n.

### 11. n8n + RAG

La consulta en lenguaje natural debe hacerse en la interfaz de n8n.

Debe cumplir con esto:
- Recibir la pregunta del usuario.
- Recuperar información relevante desde la base de datos.
- Generar una respuesta usando RAG.
- Mostrar la conversación en la interfaz de n8n.
- Registrar en logs tanto la pregunta como la respuesta.

No se necesita hacer un sistema RAG muy grande o complejo.  
Si el volumen de datos es pequeño, basta con recuperar datos relevantes y responder sobre esa información.

### 12. Docker y despliegue

Toda la aplicación debe correr en contenedores.

Contenedores mínimos:
- frontend
- postgres
- service-create
- service-update
- service-delete
- service-query
- service-log
- n8n

Puntos importantes:
- Postgres debe estar en un contenedor independiente.
- El servicio de consultar debe estar separado y apagable.
- Docker Compose debe ser el punto de arranque de toda la aplicación.

### 13. Orden recomendado de desarrollo

Para no enredarnos, conviene seguir este orden:

1. Definir el esquema de la base de datos.
2. Crear las tablas personas y logs.
3. Probar inserciones y consultas básicas.
4. Implementar la autenticación con Supabase.
5. Implementar el microservicio crear.
6. Implementar el microservicio modificar.
7. Implementar el microservicio borrar.
8. Implementar el microservicio consultar.
9. Implementar el microservicio log.
10. Construir el frontend.
11. Integrar la subida de fotos con Supabase Storage.
12. Integrar n8n con la base de datos.
13. Registrar rag_question y rag_answer en logs.
14. Contenerizar todo con Docker Compose.
15. Probar validaciones y flujos completos.

### 14. Checklist final

Antes de darlo por terminado, revisemos que esto funcione:

- Login.
- CRUD por documento funcionando.
- Validaciones completas en formulario.
- Fotos subidas correctamente y guardadas como URL/path.
- Logs de todas las transacciones.
- Búsqueda de logs por tipo, documento y fecha.
- Consulta en lenguaje natural funcionando en n8n.
- Preguntas y respuestas de RAG registradas en logs.
- Todo corriendo en contenedores.
- Base de datos en contenedor independiente.
- Servicio de consultar separado y apagable.

## La idea general es mantener la solución simple, modular y fácil de explicar.  
