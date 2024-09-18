import pkg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Definir __dirname manualmente para ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pkg;

// Cargar el archivo de variables de entorno
dotenv.config({ path: '.env' });

// Verificar si estamos en producción o en desarrollo
const isProduction = process.env.NODE_ENV === 'production';

// Determinar la URL de la base de datos a usar
const connectionString = isProduction
  ? process.env.DATABASE_URL_EXTERNAL // Usar la URL externa en producción
  : process.env.DATABASE_URL_INTERNAL; // Usar la URL interna en desarrollo

// Crear la instancia de Pool para la conexión a la base de datos
const pool = new Pool({
  connectionString: connectionString,
  ssl: isProduction
    ? {
        rejectUnauthorized: false, // Permitir conexiones SSL en producción
      }
    : false, // Sin SSL en entornos de desarrollo/local
});

// Función para ejecutar los scripts SQL desde archivos
const executeSQLFile = async (filePath) => {
  try {
    const sql = fs.readFileSync(filePath, 'utf-8');
    await pool.query(sql);
    console.log(`Ejecutado con éxito: ${path.basename(filePath)}`);
  } catch (err) {
    console.error(`Error al ejecutar ${path.basename(filePath)}:`, err);
  }
};

// Función principal para crear y poblar las tablas
const setupDatabase = async () => {
  try {
    // Crear las tablas
    await executeSQLFile(path.join(__dirname, 'config', 'database.sql'));

    // Poblar las tablas con datos iniciales
    await executeSQLFile(path.join(__dirname, 'config', 'insert_instruments.sql'));

    console.log('¡Base de datos configurada con éxito!');
  } catch (err) {
    console.error('Error configurando la base de datos:', err);
  } 
};

// Llamar a la función para configurar la base de datos si es necesario
setupDatabase();

export default pool;
