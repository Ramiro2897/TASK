import { Request, Response, NextFunction } from 'express';

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1]; // Extraer el token del header
  if (!token) {
    res.status(401).json({ error: 'Token no proporcionado' });
    console.log('Token hijo mio:'); // Para pruebas

    return; // Terminar la ejecución del middleware
  }
  console.log('Token recibido xd:', token); // Para pruebas
  next(); // Continuar al siguiente middleware si todo está bien
};

