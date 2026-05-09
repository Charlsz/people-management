// Punto de entrada del servicio logs.

import express from 'express';
import dotenv from 'dotenv';
import router from './route';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;

app.use(express.json());
app.use('/api', router);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'logs' });
});

app.listen(PORT, () => {
  console.log(`logs corriendo en puerto ${PORT}`);
});