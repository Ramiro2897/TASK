import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import axios from 'axios';
import '../styles/home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ModalTask from '../components/ModalTask';  
import Modalphrases from '../components/Modalphrases'; 
import ModalGoals from '../components/ModalGoals'; 



const Home = () => {
  const username = localStorage.getItem('username');
  const navigate = useNavigate(); // Hook para redirigir al usuario

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPhraseModalOpen, setIsPhraseModalOpen] = useState(false);
  const [isModalGoalsOpen, setIsModalGoalsOpen] = useState(false);

  // abrir y cerrar modales
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openPhraseModal = () => {
    setIsPhraseModalOpen(true);
  };
  
  const closePhraseModal = () => {
    setIsPhraseModalOpen(false);
  };


  const openGoalsModal = () => {
    setIsModalGoalsOpen(true);
  };

  const closeGoalsModal = () => {
    setIsModalGoalsOpen(false);
  };

   // Estados para almacenar datos
  //  const [tareas, setTareas] = useState([]);
  //  const [metas, setMetas] = useState([]);
  //  const [frases, setFrases] = useState([]);

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
              <button className="add-button" onClick={openModal}>
                <FontAwesomeIcon icon={faPlus} /> Agregar Tarea
              </button>
            </div>
  
            {/* 🎯 SECCIÓN DE FRASES */}
            <div className="card">
              <h3>Frases o Diario</h3>
              <div className="list-container">
                {/* Aquí irán las metas agregadas */}
                <p className="empty-text">No hay frases aún.</p>
              </div>
              <button className="add-button" onClick={openPhraseModal}>
                <FontAwesomeIcon icon={faPlus} /> Agregar Frase
              </button>
            </div>
  
            {/* ✨ SECCIÓN DE FRASES */}
            <div className="card">
              <h3>Metas</h3>
              <div className="list-container">
                {/* Aquí irán las frases agregadas */}
                <p className="empty-text">No hay metas aún.</p>
              </div>
              
              <button className="add-button" onClick={openGoalsModal}>
                <FontAwesomeIcon icon={faPlus} /> Agregar Meta
              </button>
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

      {/* modales */}
        <ModalTask
        isOpen={isModalOpen}  
        onClose={closeModal}  
        onSubmit={() => {}}
      />

      <Modalphrases
        isOpen={isPhraseModalOpen}  
        onClose={closePhraseModal}  
        onSubmit={() => {}}
      />

      <ModalGoals
        isOpen={isModalGoalsOpen}
        onClose={closeGoalsModal}
        onSubmit={() => {}}
      />
    </div>
  );

};

export default Home;
