import express from 'express';
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

export default router;



