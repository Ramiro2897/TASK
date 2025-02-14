import { Request, Response } from 'express';
import { pool } from '../index';  // Importamos la conexión a la base de datos

export const getUserTasks = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.headers['user-id']; // Extraemos el userId desde los headers

    // console.log('userId de las tareas a consultar para el usuario:', userId);

    if (!userId || userId === '') {
      return res.status(400).json({
        errors: { userId: 'El ID de usuario es obligatorio.' }
      });
    }

    // Hacer la consulta para obtener todas las tareas que no estén archivadas (archived = false)
    let result = await pool.query(
      'SELECT * FROM tasks WHERE user_id = $1 AND archived = false ORDER BY created_at DESC',
      [userId]
    );

    // Si no hay tareas, buscamos las más recientes sin importar el estado de archivado
    if (result.rows.length === 0) {
      console.log('No se encontraron tareas recientes. Buscando las tareas más recientes disponibles...');
      result = await pool.query(
        'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5', // Limitamos a las 5 tareas más recientes
        [userId]
      );
    }

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener las tareas:', error);
    return res.status(500).json({
      errors: { general: 'Error del servidor, intenta de nuevo más tarde.' }
    });
  }
};
