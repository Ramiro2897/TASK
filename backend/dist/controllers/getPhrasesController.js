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
exports.getPhrases = void 0;
const index_1 = require("../index"); // Importamos la conexión a la base de datos
const getPhrases = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Verificar si el usuario está autenticado
        const user = req.user;
        if (!user) {
            return res.status(401).json({ errors: { general: "Usuario no autenticado" } });
        }
        const result = yield index_1.pool.query('SELECT id, phrase, author, favorite, created_at FROM phrases WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [user.id]);
        // console.log('Frase obtenida de la base de datos:', result.rows);
        return res.status(200).json(result.rows); // Enviamos solo la primera frase
    }
    catch (error) {
        console.error('Error al obtener las frases:', error);
        return res.status(500).json({
            errors: { server: 'Error al obtener las frases.' }
        });
    }
});
exports.getPhrases = getPhrases;
