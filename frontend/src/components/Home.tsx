import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import axios from 'axios';
import '../styles/home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  const username = localStorage.getItem('username');
  const navigate = useNavigate(); // Hook para redirigir al usuario

   // Estados para almacenar datos
   const [tareas, setTareas] = useState([]);
   const [metas, setMetas] = useState([]);
   const [frases, setFrases] = useState([]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No se encontró token en localStorage');
        return;
      }
      const API_URL = import.meta.env.VITE_API_URL;
      await axios.post(
        `${API_URL}/api/auth/logout`, 
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
      // Eliminar los datos del localStorage al cerrar sesión
      localStorage.clear();
      // Redirigir al login
      navigate('/');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleConsulta = async () => {
    try {
      const token = localStorage.getItem('token'); // Obtener el token del localStorage
      if (!token) {
        console.error('No se encontró token en localStorage');
        return;
      }

      const API_URL = import.meta.env.VITE_API_URL;
      // Realizar la solicitud al backend para consultar usuarios
      const response = await axios.get(`${API_URL}/Consulta`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pasar el token en los headers
        },
      });

      console.log('Respuesta del servidor:', response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error en la consulta (Axios):', error.response?.data || error.message);
      } else {
        console.error('Error desconocido en la consulta:', error);
      }
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="home-container">
      {username ? (
        <>
          <div className="header">
          <h1 className="welcome-text">
            Bienvenido, <span className="username">{username}</span> <span className="wave">👋</span>
          </h1>
            <div className="header-buttons">
            <button onClick={handleLogout} className="logout-button" title="Cerrar sesión">
              <FontAwesomeIcon icon={faSignOutAlt} />
            </button>
              {/* <button onClick={handleConsulta} className="consulta-button">
                Con
              </button> */}
            </div>
          </div>
  
          <div className="dashboard">
            {/* 📌 SECCIÓN DE TAREAS */}
            <div className="card">
              <h3>Tareas Diarias</h3>
              <div className="list-container">
                {/* Aquí irán las tareas agregadas */}
                <p className="empty-text">No hay tareas aún.</p>
              </div>
              <button className="add-button">➕ Agregar Tarea</button>
            </div>
  
            {/* 🎯 SECCIÓN DE METAS */}
            <div className="card">
              <h3>Metas</h3>
              <div className="list-container">
                {/* Aquí irán las metas agregadas */}
                <p className="empty-text">No hay metas aún.</p>
              </div>
              <button className="add-button">➕ Agregar Meta</button>
            </div>
  
            {/* ✨ SECCIÓN DE FRASES */}
            <div className="card">
              <h3>Frases o Diario</h3>
              <div className="list-container">
                {/* Aquí irán las frases agregadas */}
                <p className="empty-text">No hay frases aún.</p>
              </div>
              <button className="add-button">➕ Agregar Frase</button>
            </div>
          </div>

           {/* Footer */}
          <footer className="footer">
            <p>© TASLY - Created by Ramiro {currentYear}</p>
          </footer>
        </>
      ) : (
        "Cargando..."
      )}
    </div>
  );

};

export default Home;
