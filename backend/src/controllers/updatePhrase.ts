import { Request, Response } from 'express';
import { pool } from '../index';  // Importamos la conexión a la base de datos
import { QueryResult } from 'pg'; // Importamos el tipo correcto para la consulta

export const updatePhrase = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { taskId, updatedDate, editedName } = req.body;
    const userId = req.headers['user-id'];

    // Validación de datos requeridos
    if (!taskId || !userId || !updatedDate || !editedName) {
      return res.status(400).json({
        errors: { errorUpdate: 'Faltan datos para actualizar la frase.' }
      });
    }

    // Validación de fecha
    const today = new Date().toISOString().split('T')[0];
    if (updatedDate < today) {
      return res.status(400).json({
        errors: { errorUpdate: 'Fecha de actualización pasada.' }
      });
    }

    // Verificamos si la frase pertenece al usuario y si está completada
    const phraseResult: QueryResult = await pool.query(
      'SELECT id FROM phrases WHERE id = $1 AND user_id = $2',
      [taskId, userId]
    );

    if (phraseResult.rows.length === 0) {
      return res.status(404).json({ errors: { errorUpdate: 'La frase no pertenece al usuario.' } });
    }

    // Actualización de la frase
    const updateResult: QueryResult = await pool.query(
      'UPDATE phrases SET created_at = $1, phrase = $2 WHERE id = $3 AND user_id = $4',
      [updatedDate, editedName, taskId, userId]
    );

    // 🔹 Solución: Verificamos `rowCount ?? 0` para evitar errores de `null`
    if ((updateResult.rowCount ?? 0) > 0) {
      return res.status(200).json({ message: 'Frase actualizada correctamente.' });
    }

    return res.status(400).json({
      errors: { errorUpdate: 'No se pudo actualizar la frase, verifica los datos.' }
    });

  } catch (error) {
    console.error('💥 Error al actualizar la frase:', error);
    return res.status(500).json({
      errors: { errorUpdate: 'Error al actualizar la frase.' }
    });
  }
};
