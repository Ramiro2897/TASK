import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import axios from 'axios';
import { useEffect } from "react";
import styles from '../styles/home.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faSadTear, faPlus, faHeartCircleBolt, faClock, faQuestion } from "@fortawesome/free-solid-svg-icons";
import ModalTask from '../components/ModalTask';  
import Modalphrases from '../components/Modalphrases'; 
import ModalGoals from '../components/ModalGoals'; 


const Home = () => {
  const username = localStorage.getItem('username');
  const navigate = useNavigate(); // Hook para redirigir al usuario

  // manejar errores del servidor
  const [errors, setErrors] = useState<{ userId?: string; general?: string }>({});

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
  // -------------.......-----------

   // Estados para almacenar datos
  const [tareas, setTareas] = useState<{ id: number, task_name: string, complete: boolean, created_at: string }[]>([]);
  const [metas, setMetas] = useState<{ id: number; goal: string; description: string; start_date: string; end_date: string; unit: string; }[]>([]);
  const [frases, setFrases] = useState<{ id: number; phrase: string; author: string; created_at: string; favorite: boolean; }[]>([]);

  const token = localStorage.getItem('token');

  if (!token) {
    return;
  }

  // obtenemos el momento del dia para saber en que momento cambiar el esta de: taskNotified para que pueda notificar
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;
  
    const fetchData = async () => {
      try {
        const [tareasRes, frasesRes, metasRes] = await Promise.all([
          axios.get(`${API_URL}/api/auth/tasklist`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/api/auth/phraseslist`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/api/auth/goallist`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
      
        setTareas(tareasRes.data);
        setFrases(frasesRes.data);
        setMetas(metasRes.data);
      
        console.log(tareasRes.data, 'tareas del usuario');
      
        // Manejo de notificación
        const latestTask = tareasRes.data[0];
        const currentDate = new Date();
        const taskDate = new Date(latestTask?.created_at);
        const isTaskIncomplete = !latestTask?.complete;
        const taskNotified = localStorage.getItem("taskNotified") === "true";
      
        if (isTaskIncomplete && taskDate < currentDate && taskNotified) {
          setShowAlert(true);
          localStorage.setItem("taskNotified", "false");
        
          setTimeout(() => {
            setShowAlert(false);
          }, 30000);
        } else {
          setShowAlert(false); // Aseguramos que la alerta se oculte si no se cumple la condición
        }
      } catch (error: any) {
        console.error("Error al obtener los datos:", error);
        setErrors(error.response?.data.errors || { general: "Error inesperado. Comunícalo al programador." });
      }
    };
  
    fetchData();
  }, [token]);

// Manejamos la notificación en otro useEffect independiente
  useEffect(() => {
    const currentDate = new Date();
    const hours = currentDate.getHours();
    let currentPeriod = '';

    if (hours >= 0 && hours < 8) {
      console.log('Periodo: morning');
      currentPeriod = 'morning';
    } else if (hours >= 8 && hours < 18) {
      console.log('Periodo: afternoon');
      currentPeriod = 'afternoon';
    } else {
      console.log('Periodo: night');
      currentPeriod = 'night';
    }

    const lastNotifiedPeriod = localStorage.getItem("lastNotifiedPeriod");
    console.log(lastNotifiedPeriod, 'último periodo notificado');

    if (lastNotifiedPeriod !== currentPeriod) {
      console.log('🚀 Se activará la notificación');
      localStorage.setItem("taskNotified", "true");
      localStorage.setItem("lastNotifiedPeriod", currentPeriod);
    }
  }, []);


   // Función para actualizar la tarea en tiempo real
   const handleTaskAdded = (newTask: { message: string; task: { id: number; task_name: string; complete: boolean; created_at: string } }) => {
    // Extraemos la tarea correctamente
    const task = newTask.task;
    setTareas(() => {
      return [task]; // Actualizamos el estado con la nueva tarea
    });
  };

  // funcion para actualizar la frase en tiempo real
  const handlePhrasesAdded = (newPhrases: { message: string; phrase: { id: number; phrase: string; author: string; user_id: number; created_at: string; favorite: boolean; } }) => {
    // Extraemos la frase correctamente
    const phrase = newPhrases.phrase;  
    setFrases([phrase]); // Actualizamos el estado con solo la nueva frase
  };

  // Función para actualizar la meta en tiempo real
  const handleGoalsAdded = (newGoal: { message: string; goal: { id: number; goal: string; description: string; start_date: string; end_date: string; unit: string } }) => {
    // Extraemos la meta correctamente
    const goal = newGoal.goal;
    setMetas([goal]);// Actualizamos el estado con solo la nueva meta
  };


  // validacion del Home, si no tiene token lo mandamos al login
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No tienes token para iniciar sesion');
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

  // funcion para llevar al componente task
  const handleNavigate = () => {
    navigate('/tasks');  // Redirige a "/tasks"
  };

  // funcion que lleva a el modulo de información
  const handleGoInformation = () => {
    navigate("/information"); // Navega a la página Home
  };

  // funcion para llevar a frases
  const handleGoPhrases = ()=>{
    navigate("/phrases");
  }

  return (
    <div className={styles['home-container']}>
      {/* mostrar que tiene tareas pendientes */}
      {showAlert && (
        <div className={styles['card-notification']}>
          <div className={styles.icon}>
            <FontAwesomeIcon icon={faSadTear} className={styles['alert-icon']} />
          </div>
          <div className={styles['modal-content-notification']}>
            <p className={styles['message-text']}>Tareas pendientes</p>
            <p className={styles['sub-text']}>Tienes tareas que debes completar</p>
          </div>
        </div>
      )}
  
      {/* mostrar error aqui */}
      <div className={styles.errors}>
        {errors.userId && <p className={styles.error}>{errors.userId}</p>}
        {errors.general && <p className={styles.error}>{errors.general}</p>}
      </div>
  
      {username ? (
        <>
          <div className={styles.header}>
            <h1 className={styles['welcome-text']}>
              Bienvenido, <span className={styles.username}>{username}</span> <span className={styles.wave}>👋</span>
            </h1>
            <div className={styles['header-buttons']}>
              <button onClick={handleLogout} className={styles['logout-button']} title="Cerrar sesión">
                <FontAwesomeIcon icon={faSignOutAlt} />
              </button>
            </div>
          </div>
  
          <div className={styles.dashboard}>
            {/* 📌 SECCIÓN DE TAREAS */}
            <div className={styles.card}>
              <h3>Tareas Diarias</h3>
              <div className={`${styles['list-container']} ${showAlert ? styles['alert-red'] : ''}`} onClick={handleNavigate}>
                {tareas.length > 0 ? (
                  <div className={styles['task-text']} title='Ver contenido'>
                    {/* Mostrar task_name */}
                    <div className={styles['title-name']}>
                      {tareas[0].task_name && tareas[0].task_name.length > 25
                        ? `${tareas[0].task_name.substring(0, 25)}...`
                        : tareas[0].task_name}
                    </div>
  
                    {/* Mostrar si la tarea está completa */}
                    <div className={styles['task-status']}>
                      {tareas[0].complete ? (
                        <span className={styles['complete-status']}>Completada</span>
                      ) : (
                        <span className={styles['incomplete-status']}>Pendiente</span>
                      )}
                    </div>
  
                    {/* Mostrar la fecha de creación de la tarea */}
                    <div className={styles['task-date']}>
                      <FontAwesomeIcon icon={faClock} style={{ marginRight: '5px' }} />
                      {new Date(tareas[0].created_at)
                        .toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                        .replace(/ de /g, ' ')}
                    </div>
                  </div>
                ) : (
                  <p className={styles['empty-text']}>No hay tareas aún.</p>
                )}
              </div>
  
              <button className={styles['add-button']} onClick={() => openModal()}>
                <FontAwesomeIcon icon={faPlus} /> Agregar Tarea
              </button>
            </div>
  
            {/* 🎯 SECCIÓN DE FRASES */}
            <div className={styles.card}>
              <h3>Frases o Notas</h3>
              <div className={styles['list-container']} onClick={handleGoPhrases}>
                {frases.length > 0 ? (
                  <div className={styles['task-text']}>
                    <div className={styles['title-name']}>
                      {frases[0].phrase && frases[0].phrase.length > 25
                        ? `${frases[0].phrase.substring(0, 25)}...`
                        : frases[0].phrase}
                    </div>
                    <div className={styles['author-info']}>
                      <div className={styles['content-author']}>
                        <span className={styles.author}>{frases[0].author}</span>
                        <span className={`${styles['favorite-icon']} ${frases[0].favorite ? styles.favorite : styles['not-favorite']}`}>
                          <FontAwesomeIcon icon={faHeartCircleBolt} />
                        </span>
                      </div>
                      <span className={styles['task-date']}>
                        <FontAwesomeIcon icon={faClock} style={{ marginRight: '5px' }} />
                        {new Date(frases[0].created_at)
                          .toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                          .replace(/ de /g, ' ')}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className={styles['empty-text']}>No hay frases aún.</p>
                )}
              </div>
  
              <button className={styles['add-button']} onClick={openPhraseModal}>
                <FontAwesomeIcon icon={faPlus} /> Agregar Frase
              </button>
            </div>
  
            {/* ✨ SECCIÓN DE METAS */}
            <div className={styles.card}>
              <h3>Metas</h3>
              <div className={styles['list-container']}>
                {metas.length > 0 ? (
                  <div className={styles['task-text']}>
                    <div className={styles['title-name']}>
                      <p className={styles.goals}>
                        {metas[0].goal && metas[0].goal.length > 25
                          ? `${metas[0].goal.substring(0, 25)}...`
                          : metas[0].goal}
                      </p>
                    </div>
                    <p className={styles['goals-unit']}> {metas[0].unit}</p>
                    <p className={styles['task-date']}>
                      <FontAwesomeIcon icon={faClock} style={{ marginRight: '5px' }} />
                      Termina el: {metas[0].start_date
                        ? new Date(metas[0].end_date)
                            .toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                            .replace(/ de /g, ' ')
                        : 'Fecha no disponible'}
                    </p>
                  </div>
                ) : (
                  <p className={styles['empty-text']}>No hay metas aún.</p>
                )}
              </div>
  
              <button className={styles['add-button']} onClick={openGoalsModal}>
                <FontAwesomeIcon icon={faPlus} /> Agregar Meta
              </button>
            </div>
          </div>
  
          {/* Footer */}
          <footer className={styles['footer']}>
            <p>© TASLY - Created by Ramiro {currentYear} <span className={styles['span']} title='información' 
            onClick={handleGoInformation}><FontAwesomeIcon icon={faQuestion} /></span></p>
          </footer>
        </>
      ) : (
        'Cargando...'
      )}
  
      {/* modales donde se maneja el actualizar tarea, el cerrar modal, desde ModalTask a Home */}
      <ModalTask
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={() => {}}
        onTaskAdded={handleTaskAdded}
      />
  
      <Modalphrases
        isOpen={isPhraseModalOpen}
        onClose={closePhraseModal}
        onSubmit={() => {}}
        onPhrasesAdded={handlePhrasesAdded}
      />
  
      <ModalGoals
        isOpen={isModalGoalsOpen}
        onClose={closeGoalsModal}
        onSubmit={() => {}}
        onGoalsAdded={handleGoalsAdded}
      />
    </div>
  );

};

export default Home;
