import { Request, Response } from 'express';
import { pool } from '../index'; // Importamos la conexión a la base de datos

export const deleteTask = async (req: Request, res: Response): Promise<Response> => {
  try {
    const taskId = req.headers['task-id'];
    const userId = req.headers['user-id'];
    console.log('datos al eliminar', taskId, userId);

    // Validamos que el taskId y userId estén presentes
    if (!taskId || !userId) {
      return res.status(400).json({
        errors: { general: 'Fallo en el usuario.' }
      });
    }

    // Verificamos que la tarea pertenezca al usuario antes de eliminarla
    const taskResult = await pool.query(
      'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
      [taskId, userId]
    );

    if (taskResult.rows.length === 0) {
      return res.status(404).json({ errors: { general: 'Tarea no encontrada o no pertenece al usuario.' } });
    }

    // Eliminamos la tarea
    await pool.query('DELETE FROM tasks WHERE id = $1', [taskId]);

    // Respondemos con un mensaje de éxito
    return res.status(200).json({ message: 'Tarea eliminada correctamente.' });

  } catch (error) {
    console.error('Error al eliminar la tarea:', error);
    return res.status(500).json({
      errors: { server: 'Error al eliminar la tarea.' }
    });
  }
};
