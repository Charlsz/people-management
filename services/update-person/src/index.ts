// Punto de entrada del servicio update-person.

import express from 'express';
import dotenv from 'dotenv';
import router from './route';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use('/api', router);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'update-person' });
});

app.listen(PORT, () => {
  console.log(`update-person corriendo en puerto ${PORT}`);
});