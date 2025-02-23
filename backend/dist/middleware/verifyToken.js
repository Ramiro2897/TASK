"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const verifyToken = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // Extraer el token del header
    if (!token) {
        res.status(401).json({ error: 'Token no proporcionado' });
        console.log('No mando el token'); // Para pruebas
        return; // Terminar la ejecución del middleware
    }
    // console.log('Token recibido xdxd:', token); // Para pruebas
    next(); // Continuar al siguiente middleware si todo está bien
};
exports.verifyToken = verifyToken;
