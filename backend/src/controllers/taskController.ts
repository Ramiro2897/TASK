import { Request, Response } from 'express';
import { pool } from '../index';  // Importa la conexión desde index.ts

export const createTask = async (req: Request, res: Response): Promise<Response> => {
  const { task, startDate, endDate, category, priority, userId } = req.body;

  // Obtener la fecha actual en formato YYYY-MM-DD
  const today = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).split('/').reverse().join('-');
  

  if (!userId) {
    console.log('Datos incompletos - userId:', userId);
    return res.status(400).json({
      errors: { task_name: 'Error inesperado.' }
    });
  }

  // validamos el nombre de la tarea
  if (task.length > 40) {
    console.log('Nombre de la tarea demasiado largo:', task);
    return res.status(400).json({
      errors: { task_name: 'Nombre de la tarea muy extenso.' }
    });
  }
  

  // Validaciones de entrada para asegurarse de que los campos sean correctos
  if (!task || task.trim() === '') {
    console.log('Datos incompletos - task_name:', task);
    return res.status(400).json({
      errors: { task_name: 'El nombre de la tarea no puede estar vacío.' }
    });
  }

  if (!startDate || !endDate) {
    console.log('Datos incompletos - fechas:', endDate, startDate);
    return res.status(400).json({
      errors: { date: 'Las fechas de inicio y fin son obligatorias.' }
    });
  }

  if (startDate < today) {
    console.log('Fecha de inicio en el pasado:', startDate);
    return res.status(400).json({
      errors: { date: 'Fecha de inicio en el pasado.' }
    });
  }

  if (endDate < startDate) {
    console.log('Fecha de fin menor a la de inicio:', endDate, startDate);
    return res.status(400).json({
      errors: { date: 'Fecha final menor que la de inicio.' }
    });
  }

  if (!category || category.trim() === '') {
    console.log('Datos incompletos - category:', category);
    return res.status(400).json({
      errors: { category: 'La categoría de la tarea es obligatoria.' }
    });
  }

  if (!priority || priority.trim() === '') {
    console.log('Datos incompletos - priority:', priority);
    return res.status(400).json({
      errors: { priority: 'La prioridad de la tarea es obligatoria.' }
    });
  }

  try {
    console.log('Paso la validación, guardando tarea...');
    // Insertamos la nueva tarea en la base de datos
    const result = await pool.query(
      `INSERT INTO tasks (task_name, start_date, end_date, category, priority, complete, created_at, updated_at, user_id)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $7) RETURNING *`,
      [task, startDate, endDate, category, priority, false, userId]  // Aquí pasamos el userId como parámetro
    );

    const newTask = result.rows[0];
    return res.status(201).json({ message: 'Tarea creada con éxito', task: newTask });

  } catch (error) {
    console.error('Error en la creación de tarea:', error);
    return res.status(500).json({
      errors: { general: 'Error del servidor, intenta de nuevo más tarde.' }
    });
  }
};
