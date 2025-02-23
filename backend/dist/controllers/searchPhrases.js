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
exports.searchPhrases = void 0;
const index_1 = require("../index"); // Importamos la conexión a la base de datos
const searchPhrases = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const result = yield index_1.pool.query('SELECT * FROM phrases WHERE user_id = $1 AND phrase ILIKE $2 ORDER BY created_at DESC', [userId, `%${query}%`]);
        if (result.rows.length === 0) {
            console.log('no hay frases');
            return res.status(404).json({
                errors: { general: 'No se encontraron frases.' }
            });
        }
        return res.status(200).json(result.rows);
    }
    catch (error) {
        console.error('Error al buscar frases:', error);
        return res.status(500).json({
            errors: { general: 'Error del servidor, intenta de nuevo más tarde.' }
        });
    }
});
exports.searchPhrases = searchPhrases;
