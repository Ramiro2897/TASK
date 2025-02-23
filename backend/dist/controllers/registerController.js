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
exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../index");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        // Validar si el nombre de usuario está vacío
        if (!username || username.trim() === '') {
            return res.status(400).json({
                errors: { username: 'Nombre de usuario vacío.' }
            });
        }
        // Validar longitud del nombre de usuario
        if (username.length < 3) {
            return res.status(400).json({
                errors: { username: 'Ingresa al menos 3 caracteres.' }
            });
        }
        if (username.length > 15) {
            return res.status(400).json({
                errors: { username: 'Sobrepasa los 15 caracteres.' }
            });
        }
        // Validar si la contraseña está vacía
        if (!password || password.trim() === '') {
            return res.status(400).json({
                errors: { password: 'La contraseña no puede estar vacía.' }
            });
        }
        // Validar longitud de la contraseña
        if (password.length < 6) {
            return res.status(400).json({
                errors: { password: 'Ingresa al menos 6 caracteres.' }
            });
        }
        if (password.length > 20) {
            return res.status(400).json({
                errors: { password: 'Sobrepasa los 20 caracteres.' }
            });
        }
        // Validar si la contraseña contiene al menos una mayúscula
        if (!/[A-Z]/.test(password)) {
            return res.status(400).json({
                errors: { password: 'Ingresa al menos una mayúscula.' }
            });
        }
        // Validar si la contraseña contiene al menos un número
        if (!/[0-9]/.test(password)) {
            return res.status(400).json({
                errors: { password: 'Ingresa al menos un número.' }
            });
        }
        // Verificar si el usuario ya existe
        const userExists = yield index_1.pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({
                errors: { username: 'El usuario ya está registrado' }
            });
        }
        // Hashear la contraseña
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Insertar el usuario en la base de datos
        const newUser = yield index_1.pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username', [username, hashedPassword]);
        const user = newUser.rows[0];
        // Crear token JWT
        const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET || 'secretkey');
        return res.status(201).json({ message: 'Usuario registrado con éxito', token, user });
    }
    catch (error) {
        console.error('Error en el registro:', error);
        return res.status(500).json({ message: 'Error del servidor' });
    }
});
exports.register = register;
