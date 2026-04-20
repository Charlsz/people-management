## Qué hace cada archivo
index.ts: arranca el servidor.

routes.ts: define endpoints.

controller.ts: recibe request y response.

service.ts: lógica del caso de uso.

db.ts: conexión a Postgres.

validators.ts: validaciones backend.


### services/create-person/
Este servicio solo crea personas y registra el log correspondiente.

Debe validar entrada, insertar en personas, y luego registrar create en logs.

### services/update-person/
Este servicio actualiza personas existentes por documento y registra update en logs.

Debe volver a validar los campos, aunque ya se hayan validado en frontend.

### services/delete-person/
Este servicio elimina personas por documento y registra delete en logs.

Aquí debes mantener la lógica muy simple: buscar, borrar, loguear.

###services/query-person/
Este servicio consulta personas por documento y debe vivir en contenedor independiente, además de poder habilitarse o deshabilitarse según demanda.

Por eso conviene que esté completamente separado del resto y que el frontend lo trate como un servicio aparte.

### services/logs/
Este servicio consulta la tabla de logs y permite filtrar por tipo, documento y fecha, que es un requisito explícito.

No hace CRUD de personas; solo sirve para auditoría y consulta de trazabilidad.