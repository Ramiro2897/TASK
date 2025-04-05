"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTask = void 0;
const index_1 = require("../index"); // Importa la conexión desde index.ts
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { task, startDate, endDate, category, priority } = req.body;
    console.log(startDate, endDate, 'datos de fechas que necesitamos...');
    // Verificar si el usuario está autenticado
    const user = req.user;
    if (!user) {
        return res.status(401).json({ errors: { general: "Usuario no autenticado" } });
    }
    // Obtener la fecha actual en formato YYYY-MM-DD
    const now = new Date().toLocaleString('en-US', { timeZone: 'America/Bogota' });
    const today = new Date(now).getFullYear() + '-' +
        String(new Date(now).getMonth() + 1).padStart(2, '0') + '-' +
        String(new Date(now).getDate()).padStart(2, '0');
    console.log(today, 'hora colombiana');
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
    console.log('🛑🛑🛑 DEBUG INICIO PASADO 🛑🛑🛑', { today, startDate });
    if (startDate < today) {
        console.log('Fecha de inicio en el pasado xd:', today);
        console.log('🛑🛑🛑 DEBUG INICIO PASADO 🛑🛑🛑', { today, startDate });
        return res.status(400).json({
            errors: { date: 'Fecha de inicio en el pasado cd.', startDate }
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
        const result = yield index_1.pool.query(`INSERT INTO tasks (task_name, start_date, end_date, category, priority, complete, created_at, updated_at, user_id)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $7) RETURNING *`, [task, startDate, endDate, category, priority, false, user.id] // Aquí pasamos el userId como parámetro
        );
        const newTask = result.rows[0];
        return res.status(201).json({ message: 'Tarea creada con éxito', task: newTask });
    }
    catch (error) {
        console.error('Error en la creación de tarea:', error);
        return res.status(500).json({
            errors: { general: 'Error del servidor, intenta de nuevo más tarde.' }
        });
    }
});
exports.createTask = createTask;
