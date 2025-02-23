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
exports.getTasks = void 0;
const index_1 = require("../index"); // Importamos la conexión a la base de datos
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.headers['user-id']; // Extraemos el userId desde los headers
        // console.log('userId de las tareas a consultar...:', userId);
        if (!userId || userId === '') {
            return res.status(400).json({
                errors: { userId: 'El ID de usuario es obligatorio.' }
            });
        }
        // console.log(`Obteniendo tareas del usuario: ${userId}`);
        const result = yield index_1.pool.query('SELECT id, task_name, complete, created_at FROM tasks WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [userId]);
        // console.log('Tareas obtenidas de la base de datos:', result.rows); 
        return res.status(200).json(result.rows);
    }
    catch (error) {
        console.error('Error al obtener las tareas:', error);
        return res.status(500).json({
            errors: { server: 'Error al obtener las tareas.' }
        });
    }
});
exports.getTasks = getTasks;
