import { Request, Response } from 'express';
import { pool } from '../index';  // Importamos la conexión a la base de datos
import { QueryResult } from 'pg'; // Importamos el tipo correcto para la consulta

export const updateTask = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { taskId, updatedDate, updatedPriority } = req.body;
    const userId = req.headers['user-id'];

    // Validación de datos requeridos
    if (!taskId || !userId || !updatedDate || !updatedPriority) {
      return res.status(400).json({
        errors: { errorUpdate: 'Faltan datos para actualizar la tarea.' }
      });
    }

    // Validación de fecha
    const today = new Date().toISOString().split('T')[0];
    if (updatedDate < today) {
      return res.status(400).json({
        errors: { errorUpdate: 'Fecha de actualización pasada.' }
      });
    }

    // Verificamos si la tarea pertenece al usuario y si está completada
    const taskResult: QueryResult = await pool.query(
      'SELECT complete FROM tasks WHERE id = $1 AND user_id = $2',
      [taskId, userId]
    );

    if (taskResult.rows.length === 0) {
      return res.status(404).json({ errors: { errorUpdate: 'La tarea no pertenece al usuario.' } });
    }

    if (taskResult.rows[0].complete) {
      return res.status(400).json({ errors: { errorUpdate: 'No puedes actualizar una tarea completada.' } });
    }

    // Actualización de la tarea
    const updateResult: QueryResult = await pool.query(
      'UPDATE tasks SET end_date = $1, priority = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND user_id = $4',
      [updatedDate, updatedPriority, taskId, userId]
    );

    // 🔹 Solución: Verificamos `rowCount ?? 0` para evitar errores de `null`
    if ((updateResult.rowCount ?? 0) > 0) {
      return res.status(200).json({ message: 'Tarea actualizada correctamente.' });
    }

    return res.status(400).json({
      errors: { errorUpdate: 'No se pudo actualizar la tarea, verifica los datos.' }
    });

  } catch (error) {
    console.error('💥 Error al actualizar la tarea:', error);
    return res.status(500).json({
      errors: { errorUpdate: 'Error al actualizar la tarea.' }
    });
  }
};
