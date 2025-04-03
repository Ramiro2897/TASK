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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../index");
const uuid_1 = require("uuid");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    // Validaciones de entrada
    if (!username || username.trim() === '') {
        return res.status(400).json({ errors: { username: 'El nombre de usuario no puede estar vacío.' } });
    }
    if (!password || password.trim() === '') {
        return res.status(400).json({ errors: { password: 'La contraseña no puede estar vacía.' } });
    }
    try {
        const result = yield index_1.pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length === 0) {
            return res.status(400).json({ errors: { username: 'Usuario no encontrado' } });
        }
        const user = result.rows[0];
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ errors: { password: 'Contraseña incorrecta' } });
        }
        // Generar un nuevo UUID
        const newUuid = (0, uuid_1.v4)();
        yield index_1.pool.query('UPDATE users SET uuid = $1 WHERE id = $2', [newUuid, user.id]);
        // ⚠️ Asegurar que JWT_SECRET esté definido
        if (!process.env.JWT_SECRET) {
            console.error('FALTA LA VARIABLE JWT_SECRET');
            return res.status(500).json({ errors: { general: 'Error interno del servidor' } });
        }
        // Generar token sin expiración
        const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET);
        console.log('Token generado:', token);
        return res.json({
            token,
            user: { id: user.id, username: user.username } // No enviar info sensible
        });
    }
    catch (error) {
        console.error('Error en login:', error.message || error);
        return res.status(500).json({ errors: { general: 'Error del servidor, intenta de nuevo más tarde.' } });
    }
});
exports.login = login;
