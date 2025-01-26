import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../index';  // Importa la conexión desde index.ts

export const login = async (req: Request, res: Response): Promise<Response> => {
    const { username, password } = req.body;
    console.log('Solicitud recibida:', { username, password, usernameType: typeof username, passwordType: typeof password });

    // Validaciones de entrada usando el mismo formato que el registro
    if (!username || username.trim() === '') {
        console.log('entra aqui')
        return res.status(400).json({
            errors: { username: 'El nombre de usuario no puede estar vacío.' }
        });
    }

    if (!password || password.trim() === '') {
        console.log('entra aqui')
        return res.status(400).json({
            errors: { password: 'La contraseña no puede estar vacía.' }
        });
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (result.rows.length === 0) {
            return res.status(400).json({
                errors: { username: 'Usuario no encontrado' }
            });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                errors: { password: 'Contraseña incorrecta' }
            });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET || 'secretkey',
            { expiresIn: '1h' }
        );

        return res.json({ token, user: { id: user.id, username: user.username } });

    } catch (error) {
        console.error('Error en login:', error);
        return res.status(500).json({
            errors: { general: 'Error del servidor, intenta de nuevo más tarde.' }
        });
    }
};
