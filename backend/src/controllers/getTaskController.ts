import { Request, Response } from 'express';
import { pool } from '../index';  // Importamos la conexión a la base de datos

// trea una sola tarea y es la ultima jajaj
export const getTasks = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Verificar si el usuario está autenticado
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ errors: { general: "Usuario no autenticado" } });
    }

    const result = await pool.query(
      'SELECT id, task_name, complete, created_at FROM tasks WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
      [user.id]
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

// longitud de tareas para mostrar
export const getTasksLength = async (req: Request, res: Response): Promise<Response> => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ errors: { general: "Usuario no autenticado" } });
    }

    // Solo contamos las tareas pendientes (complete = false)
    const result = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM tasks
      WHERE user_id = $1
        AND complete = false
        AND archived = false
        AND start_date <= CURRENT_DATE
        AND end_date >= CURRENT_DATE
      `,
      [user.id]
    );

    const pendingTasks = parseInt(result.rows[0].total, 10);

    return res.status(200).json({ total: pendingTasks });
  } catch (error) {
    console.error('Error al obtener la longitud de tareas pendientes:', error);
    return res.status(500).json({
      errors: { server: 'Error al obtener la longitud de tareas pendientes.' }
    });
  }
};

