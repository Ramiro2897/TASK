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
exports.updatePhrase = void 0;
const index_1 = require("../index");
const updatePhrase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // 🔹 Verificar si el usuario está autenticado y obtener su ID del token
        const user = req.user;
        if (!user) {
            return res.status(401).json({ errors: { general: "Usuario no autenticado" } });
        }
        // 🔹 Extraemos los datos del cuerpo de la petición
        const { phraseId, updatedDate, editedName } = req.body;
        console.log('datos de la frase', phraseId, updatedDate, editedName);
        // 🔹 Validación de datos requeridos
        if (!phraseId || !updatedDate || !editedName) {
            return res.status(400).json({
                errors: { errorUpdate: 'Faltan datos para actualizar la frase.' }
            });
        }
        // 🔹 Validación de fecha (convertimos `updatedDate` al mismo formato para evitar errores)
        const date = new Date();
        const today = new Intl.DateTimeFormat('es-CO', {
            timeZone: 'America/Bogota',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(date).split('/').reverse().join('-');
        console.log('fecha actual colombiana', today);
        const formattedDate = new Date(updatedDate).toISOString().split('T')[0];
        console.log(formattedDate, 'fecha formateada...');
        if (formattedDate < today) {
            return res.status(400).json({
                errors: { errorUpdate: 'Fecha de actualización pasada.' }
            });
        }
        // 🔹 Verificamos si la frase pertenece al usuario
        const phraseResult = yield index_1.pool.query('SELECT id FROM phrases WHERE id = $1 AND user_id = $2', [phraseId, user.id]);
        if (phraseResult.rows.length === 0) {
            return res.status(404).json({ errors: { errorUpdate: 'La frase no pertenece al usuario.' } });
        }
        // 🔹 Actualización de la frase
        const updateResult = yield index_1.pool.query('UPDATE phrases SET created_at = $1, phrase = $2 WHERE id = $3 AND user_id = $4 RETURNING *', [updatedDate, editedName, phraseId, user.id]);
        // 🔹 Verificamos si se actualizó correctamente
        if (((_a = updateResult.rowCount) !== null && _a !== void 0 ? _a : 0) > 0) {
            return res.status(200).json({ message: 'Frase actualizada correctamente.', updatedPhrase: updateResult.rows[0] });
        }
        return res.status(400).json({
            errors: { errorUpdate: 'No se pudo actualizar la frase, verifica los datos.' }
        });
    }
    catch (error) {
        console.error('💥 Error al actualizar la frase:', error);
        return res.status(500).json({
            errors: { errorUpdate: 'Error al actualizar la frase.' }
        });
    }
});
exports.updatePhrase = updatePhrase;
