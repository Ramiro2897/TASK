import React, { useState } from "react";
import axios from "axios";
import '../styles/modalTask.css';

interface ModalGoalsProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (goalData: { goal: string; description: string; startDate: string; endDate: string; unit: string }) => void;
}

const ModalGoals: React.FC<ModalGoalsProps> = ({ isOpen, onClose, onSubmit }) => {
  const [goal, setGoal] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [unit, setUnit] = useState("km");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ goal?: string; description?: string; date?: string; unit?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = localStorage.getItem('user');
    const userId = user ? JSON.parse(user).id : '';
    const goalData = { goal, description, startDate, endDate, unit, userId };

    const token = localStorage.getItem('token');
    if (!token) return;

    const API_URL = import.meta.env.VITE_API_URL;

    try {
      await axios.post(`${API_URL}/api/auth/goals`, goalData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      onSubmit(goalData);
      setGoal("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setUnit("km");
      setSuccessMessage("La meta se agregó correctamente!");
      setErrors({});
      
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 5000);
    } catch (error: any) {
      console.log('Error:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrorMessage("No se pudo guardar la meta.");
        setTimeout(() => setErrorMessage(null), 5000);
      }
    }
  };

  const handleClose = () => {
    setGoal("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setUnit("km");
    setSuccessMessage(null);
    setErrorMessage(null);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Agregar Meta</h2>
        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <form onSubmit={handleSubmit}>
          {errors.goal && <div className="errorContainer"><span className="errorTask">{errors.goal}</span></div>}
          <input
            type="text"
            placeholder="Escribe tu meta"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />

          {errors.description && <div className="errorContainer"><span className="errorTask">{errors.description}</span></div>}
          <input
            type="text"
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.date && <div className="errorContainer"><span className="errorTask">{errors.date}</span></div>}

          <div className="starDate">
            <label htmlFor="startDate">Fecha de inicio:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="starDate">
            <label htmlFor="endDate">Fecha final:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {errors.unit && <div className="errorContainer"><span className="errorTask">{errors.unit}</span></div>}
          <select value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="" disabled>Selecciona el tipo de objetivo...</option>
            <option value="tareas">Tareas</option>
            <option value="km">Kilómetros</option>
            <option value="kg">Kilogramos</option>
            <option value="horas">Horas</option>
            <option value="minutos">Minutos</option>
            <option value="calorías">Calorías</option>
            <option value="sesiones">Sesiones</option>
            <option value="COP">Pesos colombianos</option>
            <option value="dólares">Dólares</option>
            <option value="proyectos">Proyectos</option>
            <option value="ventas">Ventas</option>
            <option value="libros">Libros</option>
            <option value="capítulos">Capítulos</option>
            <option value="artículos">Artículos</option>
            <option value="%">Porcentaje (%)</option>
            <option value="puntos">Puntos</option>
            <option value="objetos">Objetos</option>
            <option value="veces">Veces</option>
            <option value="viajes">Viajes</option>
            <option value="otros">Otros</option>
          </select>

          <div className="modal-actions">
            <button type="submit">Guardar</button>
            <button type="button" onClick={handleClose}>Cerrar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalGoals;
