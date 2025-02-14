import { useState, useEffect } from "react";
import axios from "axios";
import styles from '../styles/task.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowLeft, faQuoteLeft, faBullseye, faClock } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";


const Task = () => {
  const [tasks, setTasks] = useState<{ id: number; task_name: string; start_date: string; end_date: string; category: string; priority: string; complete: boolean; created_at: string; updated_at: string; user_id: number; }[]>([]);
  const [errors, setErrors] = useState<{ userId?: string; general?: string; message?: string; }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<{ id: number; task_name: string; start_date: string; end_date: string; category: string; priority: string; complete: boolean; created_at: string; updated_at: string; user_id: number; }[]>([]);


  useEffect(() => {
    const user = localStorage.getItem("user");
    const userId = user ? JSON.parse(user).id : "";
    const token = localStorage.getItem("token");
    console.log(user, userId, token)
    
    const loadTasks = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${API_URL}/api/auth/loadTasks`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-Id": userId,
          },
        });
        setTasks(response.data);
        console.log(response.data, 'tareas...')
      } catch (error: any) {
        console.error("Error al obtener las tareas:", error);
        if (error.response?.data.errors) {
          setErrors(error.response.data.errors);
        } else {
          setErrors({ general: "Error inesperado. Comunícalo al programador." });
        }
      }
    };

    loadTasks ();
  }, []);


  

  const handleSearch = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const user = localStorage.getItem("user");
      const userId = user ? JSON.parse(user).id : "";
      const token = localStorage.getItem("token");
      setErrors({});

      const response = await axios.get(`${API_URL}/api/auth/searchTasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "User-Id": userId,
        },
        params: {
          query: searchTerm,
        },
      });
  
      setSearchResults(response.data);// Actualiza las tareas con los resultados de la búsqueda
      console.log(response.data, 'resultados de busqueda...')
    } catch (error: any) {
      setSearchResults([]);
      setErrors(error.response?.data?.errors || { general: "Error en la búsqueda." });
      setTimeout(() => {
        setErrors((prevErrors) => ({ ...prevErrors, general: "" }));
      }, 5000); // Elimina el error después de 5 segundos
    }
  };

  // objeto que recibe las prioridades para convertirlas al español
  const priorityMap: Record<string, { label: string; className: string }> = {
    high: { label: "Difícil", className: styles.highPriority },
    medium: { label: "Intermedio", className: styles.mediumPriority },
    low: { label: "Fácil", className: styles.lowPriority }
  };
  
  // Función para obtener los valores de la prioridad
  const getPriorityData = (priority: string) => priorityMap[priority];

  // llevar a home
    const navigate = useNavigate();
  
    const handleGoHome = () => {
      navigate("/Home"); // Navega a la página Home
    };
  

  return (

    <div className={styles['task-container']}> {/* Usar estilos del módulo */}
      <div className={styles['task_header']}>
        <div className={styles['title']}>
          <h2>Tasly</h2>
        </div>
        <div className={styles['options']}>
          <div className={styles['options_list']}>
            <FontAwesomeIcon icon={faArrowLeft} onClick={handleGoHome}/> Ir Home
          </div>
          <div className={styles['options_list']}>
            <FontAwesomeIcon icon={faQuoteLeft} /> Frases
          </div>
          <div className={styles['options_list']}>
            <FontAwesomeIcon icon={faBullseye} /> Metas
          </div>
        </div>

      </div>

      {errors.userId && <p className={styles['errorTask']}>{errors.userId}</p>}
     
  
      {/* Barra de búsqueda */}
      <div className={styles['search_task']}>
        <div className={styles['content-search']}>
          <input
            type="text"
            placeholder="Buscar tarea..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </div>
      <div className={styles['error-container']}>
        {errors.general && <p className={styles['error-search']}> {errors.general}</p>}
      </div>
  
      {/* Lista de tareas */}
      <div className={styles['dashboard_task']}>
        {searchResults.length > 0
          ? searchResults.map((task) => (
            <div key={task.id} className={styles['task-item']}>
                <input 
                  type="checkbox" 
                  className={styles['custom-checkbox']} 
                  id={`task-${task.id}`} 
                  defaultChecked={task.complete} 
                />
                <label htmlFor={`task-${task.id}`} className={styles['checkbox-label']}></label>
              <p>{task.task_name} - <span>ID: {task.id}</span></p>
            </div>
            ))
          : tasks.length > 0 &&
            tasks.map((task) => (
            <div key={task.id} className={styles['task-item']}>
                <input 
                  type="checkbox" 
                  className={styles['custom-checkbox']} 
                  id={`task-${task.id}`} 
                  defaultChecked={task.complete} 
                />
                <label htmlFor={`task-${task.id}`} className={styles['checkbox-label']}></label>
                <div className={styles['content-infoTask']}>
                  
                  <div className={styles['task-name']}>
                    <p>{task.task_name}</p>
                    <div className={`${styles['task-priority']} ${getPriorityData(task.priority).className}`}>
                      {getPriorityData(task.priority).label}
                    </div>
                  </div>
                  <div className={styles['task-category']}>
                    <p>{task.category}</p> 
                  </div>
                  <div className={styles['task-date']}>
                    <div className={styles['content-date']}>
                      <p title="fecha de inicio">
                        <FontAwesomeIcon icon={faClock} style={{ marginRight: '5px' }} />
                        {new Date(task.created_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        }).replace('.', '')}
                      </p>
                      <p title="fecha final">
                        <FontAwesomeIcon icon={faClock} style={{ marginRight: '5px' }} />
                        {new Date(task.end_date).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        }).replace('.', '')}
                      </p>
                    </div>
                  </div>
                </div>   
            </div>


            ))}
      </div>
    </div>
  );
  
 
};

export default Task;

