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
exports.createPhrase = void 0;
const index_1 = require("../index"); // Importa la conexión desde index.ts
const createPhrase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phrase, userId, author } = req.body;
    console.log('Datos recibidos:', req.body);
    if (!userId) {
        console.log('Error: userId es obligatorio.');
        return res.status(400).json({
            errors: { userId: 'Error inesperado.' }
        });
    }
    if (!phrase || phrase.trim() === '') {
        console.log('Error: La frase no puede estar vacía.');
        return res.status(400).json({
            errors: { phrase: 'La frase es obligatoria.' }
        });
    }
    if (!author || author.trim() === '') {
        console.log('Error: El autor no puede estar vacío.');
        return res.status(400).json({
            errors: { author: 'El autor es obligatorio.' }
        });
    }
    const authorTrimmed = author.trim();
    const authorLength = authorTrimmed.length;
    console.log('Número de caracteres en el autor:', authorLength);
    if (authorLength > 25) {
        console.log('Error: El autor no puede tener más de 25 caracteres.');
        return res.status(400).json({
            errors: { author: 'El autor es muy extenso.' }
        });
    }
    try {
        console.log('Guardando frase en la base de datos...');
        const result = yield index_1.pool.query(`INSERT INTO phrases (phrase, author, created_at, user_id)
       VALUES ($1, $2, CURRENT_TIMESTAMP, $3) RETURNING *`, [phrase, author, userId]);
        const newPhrase = result.rows[0];
        return res.status(201).json({ message: 'Frase creada con éxito', phrase: newPhrase });
    }
    catch (error) {
        console.error('Error en la creación de frase:', error);
        return res.status(500).json({
            errors: { general: 'Error del servidor, intenta de nuevo más tarde.' }
        });
    }
});
exports.createPhrase = createPhrase;
