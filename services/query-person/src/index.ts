// Punto de entrada del servicio query-person.
// Este servicio debe estar en un contenedor independiente
// y poder habilitarse/deshabilitarse según demanda.

import express from 'express';
import dotenv from 'dotenv';
import router from './route';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

app.use(express.json());
app.use('/api', router);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'query-person' });
});

app.listen(PORT, () => {
  console.log(`query-person corriendo en puerto ${PORT}`);
});