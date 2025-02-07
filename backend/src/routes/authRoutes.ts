// import express from 'express';
import express, { Request, Response } from 'express';
import { register } from '../controllers/registerController';
import { login } from '../controllers/authController';
import { verifyToken } from '../middleware/verifyToken';
import { createTask } from '../controllers/taskController';
import { createPhrase } from '../controllers/phrasesController';
import { createGoal } from '../controllers/goalController';
import { getTasks } from '../controllers/getTaskController';
import { getPhrases } from '../controllers/getPhrasesController';
import { getGoals } from '../controllers/getGoalsController';


const router = express.Router();

// Ruta para el registro de usuarios
router.post('/register', async (req, res) => {
  await register(req, res);
});

// Ruta para el inicio de sesión
router.post('/login', async (req, res) => {
  await login(req, res);
});

router.post('/logout', (req: Request, res: Response) => {
  console.log('entra aqui')
  // Eliminar el token o cualquier otra acción que sea necesaria en el servidor
  // Si tienes alguna sesión guardada en memoria o en otro lugar, la eliminamos aquí

  // Solo respondemos que la sesión fue cerrada
  res.status(200).json({ message: 'Sesión cerrada exitosamente' });
});

// Ruta para la creación de tareas (se añade dentro de authRoutes)
router.post('/task', verifyToken, async (req, res) => {
  console.log('paso por aqui');
  await createTask(req, res); 
});

// Ruta para la creación de tareas (se añade dentro de authRoutes)
router.post('/phrase', verifyToken, async (req, res) => {
  console.log('entro aqui al crear la frase');
  await createPhrase(req, res);
});

// ruta para la creacion de metas...
router.post('/goals', verifyToken, async (req, res) => {
  console.log('entro aqui al crear una meta');
  await createGoal(req, res);
  // await createPhrase(req, res);
});

// ruta para hacer la consulta a las tareas de dicho usuario
router.get('/tasklist', verifyToken, async (req, res) => {
  // console.log('entro aqui al hacer la consulta de las tareas...');
  await getTasks(req, res); // Llamamos al controlador que obtiene las tareas
});

// ruta para hacer la consulta a las tareas de dicho usuario
router.get('/phraseslist', verifyToken, async (req, res) => {
  // console.log('entro aqui al hacer la consulta de las frases...');
  await getPhrases(req, res); // Llamamos al controlador que obtiene las tareas
});

// ruta para hacer la consulta a las metas de dicho usuario
router.get('/goallist', verifyToken, async (req, res) => {
  // console.log('entro aqui al hacer la consulta de las Metas...');
  await getGoals(req, res); // Llamamos al controlador que obtiene las tareas
});

export default router;



