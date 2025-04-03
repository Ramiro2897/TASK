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
exports.searchTasks = void 0;
const index_1 = require("../index"); // Importamos la conexión a la base de datos
const searchTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Verificar si el usuario está autenticado
        const user = req.user;
        if (!user) {
            return res.status(401).json({ errors: { general: "Usuario no autenticado" } });
        }
        const query = String(req.query.query || "").trim(); // Extraemos el término de búsqueda desde los query parameters
        console.log('usuario id:', user.id, 'query:', query);
        // Validamos si la cadena de búsqueda está vacía o contiene solo espacios en blanco
        if (typeof query === 'string' && query.trim() === "") {
            return res.status(400).json({
                errors: { general: `No se encontraron tareas` },
            });
        }
        // Hacer la consulta para buscar las tareas que coincidan con el término de búsqueda
        const result = yield index_1.pool.query('SELECT * FROM tasks WHERE user_id = $1 AND task_name ILIKE $2 ORDER BY created_at DESC LIMIT 50', [user.id, `%${query}%`]);
        if (result.rows.length === 0) {
            console.log('no hay tareasssss');
            return res.status(404).json({
                errors: { general: 'No se encontraron tareas.' }
            });
        }
        return res.status(200).json(result.rows);
    }
    catch (error) {
        console.error('Error al buscar tareas:', error);
        return res.status(500).json({
            errors: { general: 'Error del servidor, intenta de nuevo más tarde.' }
        });
    }
});
exports.searchTasks = searchTasks;
