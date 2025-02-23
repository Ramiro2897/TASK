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
const index_1 = require("../index"); //conexion bd
// Esta función marcará como 'archived' las tareas más viejas de 7 días.
const archiveOldTasks = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Obtén la fecha actual y resta 7 días
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 5); // Restamos 7 días
        // Convertimos la fecha a formato YYYY-MM-DD
        const dateThreshold = currentDate.toISOString().split('T')[0];
        console.log(`Archivando tareas creadas antes del: ${dateThreshold}`);
        // Consulta a la base de datos para actualizar las tareas
        const result = yield index_1.pool.query('UPDATE tasks SET archived = true WHERE created_at <= $1 AND archived = false', [dateThreshold]);
        console.log(`Se archivaron ${result.rowCount} tareas.`);
    }
    catch (error) {
        console.error('Error al archivar tareas:', error);
    }
});
exports.default = archiveOldTasks;
