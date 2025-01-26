import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Login.css';
import { useNavigate } from 'react-router-dom';

// import { validateUsername, validatePassword } from '../utils/validations';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate(); // Hook para redirección


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
  
    try {
       await axios.post('http://localhost:3000/api/auth/register', {
        username,
        password,
      });
      
      setMessage('Registro exitoso. Ahora puedes iniciar sesión.');
      setUsername('');
      setPassword('');
      setErrors({}); // Limpiar los errores después de un registro exitoso
      navigate('/');

    } catch (error: any) {
      if (error.response?.data.errors) {
        setErrors(error.response.data.errors); // Actualizar con los errores específicos
      } else {
        setMessage(error.response?.data.message || 'Error en el registro.');
      }
    }
  };
  
  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>TASLY</h2>

        {message && <p className="message">{message}</p>}
        
        <div className="input-group">
          <label>Usuario</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Crea un usuario"
          />
           {errors.username && <p className="error">{errors.username}</p>} 
        </div>

        <div className="input-group">
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Crea una contraseña"
          />
           {errors.password && <p className="error">{errors.password}</p>} 
        </div>

        <button type="submit">Registrarse</button>

        <div className="register-link">
          <p>¿Ya tienes cuenta? <a href="/">Inicia sesión</a></p>
        </div>
        <div className="footer">
          <p>&copy; 2025 Tasly. Todos los derechos reservados.</p>
        </div>
      </form>
    </div>
  );
};

export default Register;
