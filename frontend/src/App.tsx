import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/global.css';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import RedirectIfAuthenticated from './components/Redirect';
import RedirectRegister from './components/redirectRegister';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Ruta pública para iniciar sesión */}
          <Route path="/" element={<RedirectIfAuthenticated><Login /></RedirectIfAuthenticated>} />

          
          {/* Ruta pública para el registro */}
          <Route path="/register" element={<RedirectRegister><Register /></RedirectRegister>} />

          {/* Ruta protegida para el home, solo accesible si hay un token */}

          <Route path="/Home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
