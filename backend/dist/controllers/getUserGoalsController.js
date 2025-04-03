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
exports.getUserGoals = void 0;
const index_1 = require("../index");
const getUserGoals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Verificar si el usuario está autenticado
        const user = req.user;
        if (!user) {
            return res.status(401).json({ errors: { general: "Usuario no autenticado" } });
        }
        // console.log('userId de las metas a consultar para el usuario:', user.id);
        // Hacer la consulta para obtener todas las tareas que no estén archivadas (archived = false)
        let result = yield index_1.pool.query('SELECT * FROM goals WHERE user_id = $1 ORDER BY created_at DESC', [user.id]);
        // Si no hay frases
        if (result.rows.length === 0) {
            return res.status(404).json({
                errors: { message: 'No se encontraron metas.' }
            });
        }
        return res.status(200).json(result.rows);
    }
    catch (error) {
        console.error('Error al obtener las metas:', error);
        return res.status(500).json({
            errors: { general: 'Error del servidor, intenta de nuevo más tarde.' }
        });
    }
});
exports.getUserGoals = getUserGoals;
