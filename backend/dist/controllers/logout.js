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
exports.logout = void 0;
const index_1 = require("../index");
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user; // Ya está disponible gracias a verifyToken
        if (!user) {
            console.log('No se encontró usuario en la petición');
            res.status(401).json({ errors: { general: "Usuario no autenticado" } });
            return;
        }
        yield index_1.pool.query('UPDATE users SET uuid = NULL WHERE id = $1', [user.id]);
        console.log('Sesión cerrada correctamente');
        res.json({ message: "Sesión cerrada correctamente" });
    }
    catch (error) {
        console.error("Error en el cierre de sesión:", error);
        res.status(500).json({ errors: { general: "Error interno del servidor" } });
    }
});
exports.logout = logout;
