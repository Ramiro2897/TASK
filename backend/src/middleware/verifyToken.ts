import { Request, Response, NextFunction } from 'express';

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1]; // Extraer el token del header
  if (!token) {
    res.status(401).json({ error: 'Token no proporcionado' });
    console.log('No mando el token'); // Para pruebas
    return; // Terminar la ejecución del middleware
  }
  // console.log('Token recibido xdxd:', token); // Para pruebas
  next(); // Continuar al siguiente middleware si todo está bien
};

