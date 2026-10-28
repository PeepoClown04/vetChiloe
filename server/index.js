import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import rutasFunciones from './routes/funciones.routes.js';
import rutasPacientes from './routes/pacientes.js';

const PUERTO = process.env.PORT ?? 3000;
const app = express();

app.use(cors());

// Las fotografías base64 aumentan aproximadamente un 33% sobre los 2 MB permitidos.
const json = express.json({ limit: '4mb' });

const METODOS_CON_BODY = ['POST', 'PUT', 'PATCH'];

app.use((req, res, next) =>
  METODOS_CON_BODY.includes(req.method) ? json(req, res, next) : next(),
);

app.use('/api/pacientes', rutasFunciones);
app.use('/api/pacientes', rutasPacientes);

app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

// eslint-disable-next-line no-unused-vars -- Express exige 4 parámetros para reconocer un error handler
app.use((error, _req, res, _next) => {
  const status = error.status ?? error.statusCode ?? 500;

  if (status >= 500) console.error(error);

  res.status(status).json({
    error: status >= 500 ? 'Error interno del servidor' : error.message,
  });
});

app.listen(PUERTO, () => {
  console.log(`API vetChiloe escuchando en http://localhost:${PUERTO}/api/pacientes`);
});
