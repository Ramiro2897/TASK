import { Request, Response } from 'express';
import { pool } from '../index';  // Importamos la conexión a la base de datos

export const  searchPhrases = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.headers['user-id']; // Extraemos el userId desde los headers
    const query = req.query.query; // Extraemos el término de búsqueda desde los query parameters

    console.log('userId:', userId, 'query:', query);

    // Validamos si la cadena de búsqueda está vacía o contiene solo espacios en blanco
    if (typeof query === 'string' && query.trim() === "") {
      return res.status(400).json({
        errors: { general: 'No se encontraron frases.' },
      });
    }

    // Validamos que el userId esté presente
    if (!userId || userId === '') {
      return res.status(400).json({
        errors: { userId: 'El ID de usuario es obligatorio.' }
      });
    }

    // Hacer la consulta para buscar las tareas que coincidan con el término de búsqueda
    const result = await pool.query(
      'SELECT * FROM phrases WHERE user_id = $1 AND phrase ILIKE $2 ORDER BY created_at DESC',
      [userId, `%${query}%`]
    );

    if (result.rows.length === 0) {
      console.log('no hay frases');
      return res.status(404).json({
        errors: { general: 'No se encontraron frases.' }
      });
    }

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al buscar frases:', error);
    return res.status(500).json({
      errors: { general: 'Error del servidor, intenta de nuevo más tarde.' }
    });
  }
};
