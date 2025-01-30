// import express from 'express';
import express, { Request, Response } from 'express';
import { register } from '../controllers/registerController';
import { login } from '../controllers/authController';

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



export default router;



