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
// import express from 'express';
const express_1 = __importDefault(require("express"));
const registerController_1 = require("../controllers/registerController");
const authController_1 = require("../controllers/authController");
const verifyToken_1 = require("../middleware/verifyToken");
const taskController_1 = require("../controllers/taskController");
const phrasesController_1 = require("../controllers/phrasesController");
const goalController_1 = require("../controllers/goalController");
const getTaskController_1 = require("../controllers/getTaskController");
const getPhrasesController_1 = require("../controllers/getPhrasesController");
const getGoalsController_1 = require("../controllers/getGoalsController");
const getUserTaskController_1 = require("../controllers/getUserTaskController");
const searchTasks_1 = require("../controllers/searchTasks");
const updateTaskStatus_1 = require("../controllers/updateTaskStatus");
const deleteTask_1 = require("../controllers/deleteTask");
const updateTask_1 = require("../controllers/updateTask");
const searchPhrases_1 = require("../controllers/searchPhrases");
const getUserPhrasesController_1 = require("../controllers/getUserPhrasesController");
const deletePhrase_1 = require("../controllers/deletePhrase");
const updatePhrase_1 = require("../controllers/updatePhrase");
const router = express_1.default.Router();
// Ruta para el registro de usuarios
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, registerController_1.register)(req, res);
}));
// Ruta para el inicio de sesión
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, authController_1.login)(req, res);
}));
router.post('/logout', (req, res) => {
    console.log('entra aqui');
    // Eliminar el token o cualquier otra acción que sea necesaria en el servidor
    // Solo respondemos que la sesión fue cerrada
    res.status(200).json({ message: 'Sesión cerrada exitosamente' });
});
// Ruta para la creación de tareas (se añade dentro de authRoutes)
router.post('/task', verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('paso por aqui');
    yield (0, taskController_1.createTask)(req, res);
}));
// Ruta para la creación de tareas (se añade dentro de authRoutes)
router.post('/phrase', verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('entro aqui al crear la frase');
    yield (0, phrasesController_1.createPhrase)(req, res);
}));
// ruta para la creacion de metas...
router.post('/goals', verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('entro aqui al crear una meta');
    yield (0, goalController_1.createGoal)(req, res);
    // await createPhrase(req, res);
}));
// ruta para hacer la consulta a las tareas de dicho usuario
router.get('/tasklist', verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('entro aqui al hacer la consulta de las tareas...');
    yield (0, getTaskController_1.getTasks)(req, res); // Llamamos al controlador que obtiene las tareas
}));
// ruta para hacer la consulta a las tareas de dicho usuario
router.get('/phraseslist', verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('entro aqui al hacer la consulta de las frases...');
    yield (0, getPhrasesController_1.getPhrases)(req, res); // Llamamos al controlador que obtiene las tareas
}));
// ruta para hacer la consulta a las metas de dicho usuario
router.get('/goallist', verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('entro aqui al hacer la consulta de las Metas...');
    yield (0, getGoalsController_1.getGoals)(req, res); // Llamamos al controlador que obtiene las tareas
}));
// ruta para hacer la consulta a las tereas de dicho usuario que se muestran en el componente
router.get('/loadTasks', verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, getUserTaskController_1.getUserTasks)(req, res); // Llamamos al controlador que obtiene las tareas
}));
// ruta para hacer la busqueda de tareas de cierto usuario
router.get('/searchTasks', verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, searchTasks_1.searchTasks)(req, res); // Llamamos al controlador que obtiene las tareas
}));
// Ruta para actualizar el estado de la tarea (completa o pendiente)
router.put('/updateTask', verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, updateTaskStatus_1.updateTaskStatus)(req, res); // Llamamos al controlador para actualizar el estado
}));
// Ruta para eliminar una tarea
router.delete('/deleteTask', verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('entra aquiiiiii');
    yield (0, deleteTask_1.deleteTask)(req, res); // Llamamos al controlador para actualizar el estado
}));
// ruta para actualizar una tarea
router.put('/taskUpdate', verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('entra aquiiiiii');
    yield (0, updateTask_1.updateTask)(req, res); // Llamamos al controlador para actualizar el estado
}));
// ruta para hacer la busqueda de frases de cierto usuario
router.get('/searchPhrases', verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, searchPhrases_1.searchPhrases)(req, res);
}));
// ruta para hacer la consulta a las frases de dicho usuario que se muestran en el componente
router.get('/loadPhrases', verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, getUserPhrasesController_1.getUserPhrases)(req, res);
}));
// Ruta para eliminar una frase
router.delete('/deletePhrase', verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('eliminando frase');
    yield (0, deletePhrase_1.deletePhrase)(req, res); // Llamamos al controlador para actualizar el estado
}));
// ruta para actualizar una tarea
router.put('/phraseUpdate', verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('entra al actualizar frase');
    yield (0, updatePhrase_1.updatePhrase)(req, res); // Llamamos al controlador para actualizar el estado
}));
exports.default = router;
