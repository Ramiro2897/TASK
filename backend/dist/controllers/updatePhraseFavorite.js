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
exports.updatePhraseFavorite = void 0;
const index_1 = require("../index"); // Importamos la conexión a la base de datos
const updatePhraseFavorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Verificar si el usuario está autenticado
        const user = req.user;
        if (!user) {
            return res.status(401).json({ errors: { general: "Usuario no autenticado" } });
        }
        const phraseId = req.headers['phrase-id'];
        const favorite = req.headers['favorite'];
        console.log('datos de la frase para favorita', favorite, phraseId);
        const favoriteBool = favorite === 'true'; // Convertimos "true" en true y "false" en false
        // Validamos que phraseId y favoriteBool estén presentes y en el formato correcto
        if (!phraseId || typeof favoriteBool !== 'boolean') {
            return res.status(400).json({
                errors: { general: 'Error inesperado.' }
            });
        }
        // Realizamos la actualización en la base de datos
        const result = yield index_1.pool.query('UPDATE phrases SET favorite = $1 WHERE id = $2 RETURNING *', [favoriteBool, phraseId]);
        // Si no se encuentra la frase
        if (result.rows.length === 0) {
            return res.status(404).json({ errors: { general: 'Frase no encontrada.' } });
        }
        // Respondemos con la frase actualizada
        return res.status(200).json({ phrase: result.rows[0] });
    }
    catch (error) {
        console.error('Error al actualizar el estado de favorito:', error);
        return res.status(500).json({
            errors: { server: 'Error al actualizar el estado de favorito.' }
        });
    }
});
exports.updatePhraseFavorite = updatePhraseFavorite;
