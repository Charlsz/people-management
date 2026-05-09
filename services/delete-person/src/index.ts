// Punto de entrada del servicio delete-person.

import express from 'express';
import dotenv from 'dotenv';
import router from './route';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());
app.use('/api', router);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'delete-person' });
});

app.listen(PORT, () => {
  console.log(`delete-person corriendo en puerto ${PORT}`);
});