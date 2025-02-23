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
exports.updateTask = void 0;
const index_1 = require("../index"); // Importamos la conexión a la base de datos
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
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
        const taskResult = yield index_1.pool.query('SELECT complete FROM tasks WHERE id = $1 AND user_id = $2', [taskId, userId]);
        if (taskResult.rows.length === 0) {
            return res.status(404).json({ errors: { errorUpdate: 'La tarea no pertenece al usuario.' } });
        }
        if (taskResult.rows[0].complete) {
            return res.status(400).json({ errors: { errorUpdate: 'No puedes actualizar una tarea completada.' } });
        }
        // Actualización de la tarea
        const updateResult = yield index_1.pool.query('UPDATE tasks SET end_date = $1, priority = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND user_id = $4', [updatedDate, updatedPriority, taskId, userId]);
        // 🔹 Solución: Verificamos `rowCount ?? 0` para evitar errores de `null`
        if (((_a = updateResult.rowCount) !== null && _a !== void 0 ? _a : 0) > 0) {
            return res.status(200).json({ message: 'Tarea actualizada correctamente.' });
        }
        return res.status(400).json({
            errors: { errorUpdate: 'No se pudo actualizar la tarea, verifica los datos.' }
        });
    }
    catch (error) {
        console.error('💥 Error al actualizar la tarea:', error);
        return res.status(500).json({
            errors: { errorUpdate: 'Error al actualizar la tarea.' }
        });
    }
});
exports.updateTask = updateTask;
