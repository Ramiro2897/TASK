import { Request, Response } from 'express';
import { pool } from '../index'; // Importamos la conexión a la base de datos

export const deletePhrase = async (req: Request, res: Response): Promise<Response> => {
  try {
    const phraseId = req.headers['phrase-id'];
    const userId = req.headers['user-id'];
    console.log('datos al eliminar', phraseId, userId);

    // Validamos que el taskId y userId estén presentes
    if (!phraseId || !userId) {
      return res.status(400).json({
        errors: { general: 'Fallo en el usuario.' }
      });
    }

    // Verificamos que la tarea pertenezca al usuario antes de eliminarla
    const taskResult = await pool.query(
      'SELECT * FROM phrases WHERE id = $1 AND user_id = $2',
      [phraseId, userId]
    );

    if (taskResult.rows.length === 0) {
      return res.status(404).json({ errors: { general: 'frase no encontrada o no pertenece al usuario.' } });
    }

    // Eliminamos la tarea
    await pool.query('DELETE FROM phrases WHERE id = $1', [phraseId]);

    // Respondemos con un mensaje de éxito
    return res.status(200).json({ message: 'frase eliminada correctamente.' });

  } catch (error) {
    console.error('Error al eliminar la frase:', error);
    return res.status(500).json({
      errors: { server: 'Error al eliminar la tarea.' }
    });
  }
};
