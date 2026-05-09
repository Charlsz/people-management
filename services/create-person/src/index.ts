// Punto de entrada del servicio.
// Levanta el servidor Express y registra las rutas.

import express from 'express';
import dotenv from 'dotenv';
import router from './route';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Permite recibir JSON en el body de los requests
app.use(express.json());

// Todas las rutas del servicio bajo /api
app.use('/api', router);

// Endpoint de salud: sirve para verificar que el contenedor está vivo
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'create-person' });
});

app.listen(PORT, () => {
  console.log(`create-person corriendo en puerto ${PORT}`);
});