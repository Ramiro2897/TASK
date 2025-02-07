import { Request, Response } from 'express';
import { pool } from '../index';  // Importamos la conexión a la base de datos

export const getTasks = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.headers['user-id']; // Extraemos el userId desde los headers

    // console.log('userId de las tareas a consultar...:', userId);

    if (!userId || userId === '') {
      return res.status(400).json({
        errors: { userId: 'El ID de usuario es obligatorio.' }
      });
    }

    // console.log(`Obteniendo tareas del usuario: ${userId}`);

    const result = await pool.query(
      'SELECT id, task_name, complete, created_at FROM tasks WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
      [userId]
    );
    
    // console.log('Tareas obtenidas de la base de datos:', result.rows); 
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener las tareas:', error);
    return res.status(500).json({
      errors: { server: 'Error al obtener las tareas.' }
    });
  }
};
