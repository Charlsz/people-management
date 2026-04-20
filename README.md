# People Management

Aplicación de gestión de datos personales desarrollada como trabajo final de Diseño de software 2. El proyecto implementa autenticación, CRUD de personas, auditoría de transacciones, consulta de logs y consulta en lenguaje natural con n8n y RAG, siguiendo los requerimientos definidos para la entrega.

## Objetivo

Construir una aplicación que permita registrar, modificar, consultar y eliminar personas, manteniendo trazabilidad completa de las operaciones y soportando consultas en lenguaje natural sobre la información registrada.

## Arquitectura

La solución está organizada con una estructura modular basada en frontend, microservicios, base de datos, flujos de n8n e infraestructura de contenedores.

### Componentes principales

- Frontend en Next.js
- Supabase Auth para autenticación con proveedor reconocido
- Supabase Storage para manejo de fotos mediante URL o path
- PostgreSQL en contenedor independiente
- Microservicio para crear personas
- Microservicio para modificar personas
- Microservicio para borrar personas
- Microservicio para consultar personas, separado y habilitable según demanda
- Microservicio para consultar logs
- n8n para consulta en lenguaje natural con RAG

## Requerimientos cubiertos

- Autenticación con un sistema reconocido
- Despliegue en contenedores
- CRUD de personas con búsqueda principal por documento
- Registro de todas las transacciones en log
- Consulta en lenguaje natural utilizando n8n y RAG
- Validaciones de formulario según la consigna
- Separación por microservicios según cada opción del menú
- Servicio de consultar en contenedor independiente
- Consulta de log por tipo, documento y fecha

## Validaciones principales

Los datos personales deben cumplir validaciones definidas en frontend y backend para asegurar consistencia de la información.

- Tipo de documento: Tarjeta de identidad o Cédula
- Número de documento: solo numérico, máximo 10 caracteres
- Primer nombre: no numérico, máximo 30 caracteres
- Segundo nombre: no numérico, máximo 30 caracteres
- Apellidos: no numérico, máximo 60 caracteres
- Fecha de nacimiento: selección por calendario o formato válido
- Género: Masculino, Femenino, No binario o Prefiero no reportar
- Correo electrónico: formato válido
- Celular: solo numérico, exactamente 10 caracteres
- Foto: tamaño máximo de 2 MB

## Estructura del repositorio

```text
people-management/
├── 1-documentation/
├── database/
├── frontend/
├── infra/
├── n8n/
├── services/
├── .gitignore
└── README.md
```

### Descripción de carpetas

- `1-documentation/`: documentación funcional y técnica del proyecto, incluyendo planificación y SQL.
- `database/`: archivos relacionados con el esquema de base de datos.
- `frontend/`: aplicación principal en Next.js.
- `infra/`: configuración de Docker Compose y recursos de infraestructura.
- `n8n/`: flujos de trabajo para consulta en lenguaje natural.
- `services/`: microservicios del sistema.

## Estado del proyecto

El proyecto se está construyendo con un enfoque incremental, priorizando una arquitectura clara, bajo acoplamiento y cumplimiento de los requerimientos sin agregar complejidad innecesaria.

## Notas

La aplicación está diseñada para mantener una sola base de datos PostgreSQL y una separación clara de responsabilidades entre frontend, servicios, auditoría y consulta en lenguaje natural, con el objetivo de evitar overengineering y conservar una implementación manejable para el alcance académico del proyecto.