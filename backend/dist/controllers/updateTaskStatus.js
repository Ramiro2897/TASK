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
exports.updateTaskStatus = void 0;
const index_1 = require("../index"); // Importamos la conexión a la base de datos
const updateTaskStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskId = req.headers['task-id'];
        const complete = req.headers['complete'];
        const completeBool = complete === 'true'; // Esto convertirá "true" a true, y "false" a false
        // console.log('actualizar', taskId, completeBool);
        // Validamos que el taskId y complete estén presentes
        if (!taskId || typeof completeBool !== 'boolean') {
            return res.status(400).json({
                errors: {
                    general: 'Error inesperado.'
                }
            });
        }
        // Realizamos la actualización en la base de datos
        const result = yield index_1.pool.query('UPDATE tasks SET complete = $1, updated_at = NOW() WHERE id = $2 RETURNING *', [completeBool, taskId]);
        // Si no se encuentra la tarea
        if (result.rows.length === 0) {
            return res.status(404).json({ errors: { general: 'Tarea no encontrada.' } });
        }
        // Respondemos con la tarea actualizada
        return res.status(200).json({ task: result.rows[0] });
    }
    catch (error) {
        console.error('Error al actualizar el estado de la tarea:', error);
        return res.status(500).json({
            errors: { server: 'Error al actualizar el estado de la tarea.' }
        });
    }
});
exports.updateTaskStatus = updateTaskStatus;
