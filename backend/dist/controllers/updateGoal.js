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
exports.advanceGoal = exports.updateGoal = void 0;
const index_1 = require("../index");
const updateGoal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // 🔹 Verificar si el usuario está autenticado y obtener su ID del token
        const user = req.user;
        if (!user) {
            return res.status(401).json({ errors: { general: "Usuario no autenticado" } });
        }
        // 🔹 Extraemos los datos del cuerpo de la petición
        const { goalId, editedDescription } = req.body;
        // console.log('datos de la frase', goalId, editedDescription);
        // 🔹 Validación de datos requeridos
        if (!goalId || !editedDescription) {
            return res.status(400).json({
                errors: { errorUpdate: 'Faltan datos para agregar la nota.' }
            });
        }
        // 🔹 Verificamos si la frase pertenece al usuario
        const goalResult = yield index_1.pool.query('SELECT id FROM goals WHERE id = $1 AND user_id = $2', [goalId, user.id]);
        if (goalResult.rows.length === 0) {
            return res.status(404).json({ errors: { errorUpdate: 'La meta no pertenece al usuario.' } });
        }
        // 🔹 Actualización de la frase
        const updateResult = yield index_1.pool.query('UPDATE goals SET updated_at = NOW(), description = $1 WHERE id = $2 AND user_id = $3 RETURNING *', [editedDescription, goalId, user.id]);
        // 🔹 Verificamos si se actualizó correctamente
        if (((_a = updateResult.rowCount) !== null && _a !== void 0 ? _a : 0) > 0) {
            return res.status(200).json({ message: 'meta actualizada correctamente.', updatedGoal: updateResult.rows[0] });
        }
        return res.status(400).json({
            errors: { errorUpdate: 'No se pudo actualizar la meta, verifica los datos.' }
        });
    }
    catch (error) {
        console.error('💥 Error al actualizar la meta:', error);
        return res.status(500).json({
            errors: { errorUpdate: 'Error al actualizar la meta.' }
        });
    }
});
exports.updateGoal = updateGoal;
const advanceGoal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { goalId, newValue } = req.body;
        // console.log('lo que llega cuando entra', goalId, newValue);
        // Validaciones
        if (!goalId || !newValue) {
            return res.status(400).json({ errors: { general: "Faltan datos requeridos." } });
        }
        const numericValue = Number(newValue);
        if (isNaN(numericValue) || numericValue < 1 || numericValue > 100) {
            return res.status(400).json({ errors: { general: "El valor debe ser un número entre 1 y 100." } });
        }
        // Obtener el valor actual de la meta
        const { rows } = yield index_1.pool.query("SELECT current_value FROM goals WHERE id = $1", [goalId]);
        if (rows.length === 0) {
            return res.status(404).json({ errors: { general: "Meta no encontrada." } });
        }
        const currentValue = Number(rows[0].current_value);
        if (numericValue < currentValue) {
            return res.status(400).json({ errors: { general: "El avance no puede ser menor al valor actual." } });
        }
        // Actualizar el valor de la meta
        yield index_1.pool.query("UPDATE goals SET current_value = $1 WHERE id = $2", [numericValue, goalId]);
        res.json({ message: "Avance actualizado correctamente." });
    }
    catch (error) {
        console.error("Error al actualizar el avance:", error);
        res.status(500).json({ errors: { general: "Error interno del servidor." } });
    }
});
exports.advanceGoal = advanceGoal;
