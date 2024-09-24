import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import pool from './config/database.js';
import usersRouter from './routes/users.js';
import carritoRouter from './routes/carrito.js';
import comprasRouter from './routes/compras.js';
import instrumentosRouter from './routes/instrumentos.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Cargar variables de entorno de acuerdo al entorno
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Obtener __dirname en ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Configurar CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'https://deploy-test-2-ugsv.onrender.com', // Usar variable de entorno para el frontend
    credentials: true,
  })
);

// Servir archivos estáticos desde la carpeta 'public'
app.use('/public', express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/api/users', usersRouter);
app.use('/api/carrito', carritoRouter);
app.use('/api/compras', comprasRouter);
app.use('/api/instruments', instrumentosRouter);

// Verificar la conexión a la base de datos
pool.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    process.exit(1);
  } else {
    console.log('Conexión exitosa a la base de datos');
  }
});

// Seguridad adicional en producción
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });
}

// Ruta raíz para verificar que la API esté funcionando
app.get('/', (req, res) => {
  res.send('API del Music Store funcionando');
});

// Iniciar el servidor solo si no se está ejecutando en modo de prueba
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
  });
}

export default app;
