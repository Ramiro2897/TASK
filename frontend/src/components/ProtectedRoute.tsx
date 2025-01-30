import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem('token'); // Obtener el token almacenado

  console.log('Token en localStorage:', token);

  if (!token) {
    console.log('No hay token, redirigiendo a login...');
    return <Navigate to="/" replace />;
  }

  console.log('Token encontrado, permitiendo acceso a la ruta protegida');
  return children;
};

export default ProtectedRoute;
