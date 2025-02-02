import React, { useState } from "react";
import axios from "axios";
import '../styles/modalTask.css';

interface ModalPhrasesProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (phraseData: { phrase: string; author: string }) => void;
}

const ModalPhrases: React.FC<ModalPhrasesProps> = ({ isOpen, onClose, onSubmit }) => {
  const [phrase, setPhrase] = useState("");
  const [author, setAuthor] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ phrase?: string; author?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const user = localStorage.getItem('user');
    const userId = user ? JSON.parse(user).id : ''; 
    console.log(userId, 'aquí está el ID de frases...');

    const phraseData = { phrase, author, userId };
    
    const token = localStorage.getItem('token');
    if (!token) return;
    
    const API_URL = import.meta.env.VITE_API_URL;
    
    try {
      await axios.post(`${API_URL}/api/auth/phrase`, phraseData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      onSubmit(phraseData);
      setPhrase("");
      setAuthor("");
      setSuccessMessage("Frase agregada correctamente!");
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
        setErrorMessage('No se pudo guardar la frase.');
        setTimeout(() => setErrorMessage(null), 5000);
      }
    }
  };
    // cierra el modal y ademas eso limpia los errores etc
  const handleClose = () => {
    setPhrase("");
    setAuthor("");
    setErrors({});
    setErrorMessage(null);
    setSuccessMessage(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Agregar Frase</h2>
        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <form onSubmit={handleSubmit}>
          {errors.phrase && <div className="errorContainer"><span className="errorTask">{errors.phrase}</span></div>}
          <input
            type="text"
            placeholder="Escribe una frase"
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
          />

          {errors.author && <div className="errorContainer"><span className="errorTask">{errors.author}</span></div>}
          <input
            type="text"
            placeholder="Autor"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />

          <div className="modal-actions">
            <button type="submit">Guardar</button>
            <button type="button" onClick={handleClose}>Cerrar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalPhrases;
