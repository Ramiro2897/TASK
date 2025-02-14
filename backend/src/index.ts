import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import cors from 'cors';
import authRoutes from './routes/authRoutes';  
import cron from 'node-cron';
import archiveOldTasks from './controllers/taskArchiver';



dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Configuración de middleware
app.use(cors());
app.use(express.json());

// Configuración de la conexión a la base de datos
export const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Verificar la conexión a la base de datos
const connectDB = async () => {
  try {
    await pool.connect();
    console.log('✅ Conexión exitosa a la base de datos');
  } catch (err) {
    console.error('❌ Error al conectar a la base de datos:', err);
    process.exit(1); // Finalizar la aplicación si hay un error crítico
  }
};

connectDB();

// Ruta de prueba para verificar la conexión a la base de datos
app.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error en la base de datos:', err);
    res.status(500).send('Error en la base de datos');
  }
});

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Programamos el job para que se ejecute a las 00:00 horas del 7 de cada mes
cron.schedule('0 0 7 * *', () => {
  console.log('Ejecutando el job para archivar tareas...');
  archiveOldTasks(); // Llamamos a la función que archiva las tareas
});



// Iniciar el servidor
app.listen(3000, '0.0.0.0', () => {
  console.log('🚀 Servidor backend corriendo en http://0.0.0.0:3000');
});

