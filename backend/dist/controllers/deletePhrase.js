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
exports.deletePhrase = void 0;
const index_1 = require("../index"); // Importamos la conexión a la base de datos
const deletePhrase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Verificar si el usuario está autenticado
        const user = req.user;
        if (!user) {
            return res.status(401).json({ errors: { general: "Usuario no autenticado" } });
        }
        const phraseId = Number(req.headers['phrase-id']);
        // const userId = req.headers['user-id'];
        console.log('Datos al eliminar:', { phraseId, userId: user.id });
        // Validamos que phraseId sea valido
        if (!phraseId || isNaN(phraseId)) {
            return res.status(400).json({
                errors: { general: 'ID de la frase no válido.' }
            });
        }
        // Validamos que phraseId esté presente
        if (!phraseId) {
            return res.status(400).json({
                errors: { general: 'Fallo en el ID de la frase.' }
            });
        }
        // Verificamos que la tarea pertenezca al usuario antes de eliminarla
        const taskResult = yield index_1.pool.query('SELECT * FROM phrases WHERE id = $1 AND user_id = $2', [phraseId, user.id]);
        if (taskResult.rows.length === 0) {
            return res.status(404).json({ errors: { general: 'frase no encontrada o no pertenece al usuario.' } });
        }
        // Eliminamos la tarea
        yield index_1.pool.query('DELETE FROM phrases WHERE id = $1', [phraseId]);
        // Respondemos con un mensaje de éxito
        return res.status(200).json({ message: 'frase eliminada correctamente.' });
    }
    catch (error) {
        console.error('Error al eliminar la frase:', error);
        return res.status(500).json({
            errors: { server: 'Error al eliminar la tarea.' }
        });
    }
});
exports.deletePhrase = deletePhrase;
