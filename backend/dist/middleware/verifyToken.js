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
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../index");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SECRET_KEY = process.env.JWT_SECRET;
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]; // Extraer el token del header
        if (!token) {
            console.log("No se envió el token");
            res.status(401).json({ error: "Token no proporcionado" });
            return;
        }
        // Decodificar el token con un cast seguro
        const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        // Buscar el usuario en la base de datos y obtener su UUID
        const result = yield index_1.pool.query("SELECT * FROM users WHERE id = $1", [decoded.id]);
        if (result.rows.length === 0 || !result.rows[0].uuid) {
            console.log("Token no válido o usuario no encontrado");
            res.status(403).json({ error: "Token inválido o usuario no encontrado" });
            return;
        }
        // Guardar el usuario en la request para su uso en otros controladores
        req.user = result.rows[0];
        next(); // Pasar al siguiente middleware o controlador
    }
    catch (error) {
        console.error("Error al verificar el token:", error.message);
        res.status(401).json({ error: "Token inválido" });
    }
});
exports.verifyToken = verifyToken;
