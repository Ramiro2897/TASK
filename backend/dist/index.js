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
exports.pool = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const node_cron_1 = __importDefault(require("node-cron"));
const taskArchiver_1 = __importDefault(require("./controllers/taskArchiver"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 5000;
// Configuración de middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Configuración de la conexión a la base de datos
exports.pool = new pg_1.Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});
// Verificar la conexión a la base de datos
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.pool.connect();
        console.log('✅ Conexión exitosa a la base de datos');
    }
    catch (err) {
        console.error('❌ Error al conectar a la base de datos:', err);
        process.exit(1); // Finalizar la aplicación si hay un error crítico
    }
});
connectDB();
// Rutas de autenticación
app.use('/api/auth', authRoutes_1.default);
// Programamos el job para que se ejecute a las 00:00 horas del 7 de cada mes
node_cron_1.default.schedule('0 0 7 * *', () => {
    console.log('Ejecutando el job para archivar tareas...');
    (0, taskArchiver_1.default)(); // Llamamos a la función que archiva las tareas
});
// 📌 Servir archivos estáticos de frontend/dist
app.use(express_1.default.static(path_1.default.join(__dirname, '../../frontend/dist')));
// 📌 Servir index.html en rutas desconocidas (para React/Vite)
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../../frontend/dist/index.html'));
});
// Iniciar el servidor
app.listen(port, '0.0.0.0', () => {
    console.log(`🏠 Accede a la ruta principal en: http://localhost:${port}/Home`);
    console.log('🚀 Servidor backend corriendo en http://0.0.0.0:3000');
});
