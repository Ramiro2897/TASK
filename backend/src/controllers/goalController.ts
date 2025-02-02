import { Request, Response } from 'express';
import { pool } from '../index';  // Importa la conexión desde index.ts

export const createGoal = async (req: Request, res: Response): Promise<Response> => {
  const { goal, description, startDate, endDate, unit, userId } = req.body;
  console.log('Datos recibidos:', req.body);

  // Obtener la fecha actual en formato YYYY-MM-DD en la zona horaria de Colombia
  const today = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).split('/').reverse().join('-');

  // console.log('Fecha actual en Colombia:', today);

  if (!userId) {
    console.log('Error: userId no proporcionado');
    return res.status(400).json({
      errors: { userId: 'El ID del usuario es obligatorio.' }
    });
  }

  if (!goal || goal.trim() === '') {
    console.log('Error: El nombre de la meta está vacío');
    return res.status(400).json({
      errors: { goal: 'El nombre de la meta no puede estar vacío.' }
    });
  }

  if (!startDate || !endDate) {
    console.log('Error: Fechas incompletas', startDate, endDate);
    return res.status(400).json({ errors: { date: 'Las fechas de inicio y fin son obligatorias.' } });
  }

  // Convertir las fechas a objetos Date en la zona horaria de Colombia
  const start = new Date(`${startDate}T00:00:00-05:00`);
  const end = new Date(`${endDate}T00:00:00-05:00`);
  const todayDate = new Date(`${today}T00:00:00-05:00`);

  // Calcular la fecha mínima de finalización (3 meses después de la fecha de inicio)
  const minEndDate = new Date(start);
  minEndDate.setMonth(minEndDate.getMonth() + 3);

  if (start < todayDate) {
    console.log('Error: Fecha de inicio en el pasado:', startDate);
    return res.status(400).json({ errors: { date: 'La fecha de inicio no puede ser en el pasado.' } });
  }

  if (end < start) {
    console.log('Error: Fecha de fin menor a la de inicio:', endDate, startDate);
    return res.status(400).json({ errors: { date: 'Fecha final menor que la de inicio.' } });
  }
 
  if (end < minEndDate) {
    console.log('Error: Duración de la meta menor a 3 meses:', endDate, minEndDate.toISOString().split('T')[0]);
    return res.status(400).json({ errors: { date: 'La meta debe durar al menos 3 meses.' } });
  }

  if (!unit || unit.trim() === '') {
    console.log('Error: Unidad de la meta vacía');
    return res.status(400).json({
      errors: { unit: 'La unidad de la meta es obligatoria.' }
    });
  }

  try {
    console.log('Validación exitosa, guardando meta...');
    // Insertar la meta en la base de datos
    const result = await pool.query(
      `INSERT INTO goals (goal, description, start_date, end_date, unit, created_at, updated_at, user_id)
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $6) RETURNING *`,
      [goal, description, startDate, endDate, unit, userId]
    );

    const newGoal = result.rows[0];
    return res.status(201).json({ message: 'Meta creada con éxito', goal: newGoal });

  } catch (error) {
    console.error('Error en la creación de meta:', error);
    return res.status(500).json({
      errors: { general: 'Error del servidor, intenta de nuevo más tarde.' }
    });
  }
};
