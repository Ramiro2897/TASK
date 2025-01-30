import { Navigate } from 'react-router-dom';

interface RedirectIfAuthenticatedProps {
  children: JSX.Element;
}

const RedirectIfAuthenticated = ({ children }: RedirectIfAuthenticatedProps) => {
  const token = localStorage.getItem('token'); // Obtener el token almacenado

  console.log('Token en localStorage:', token);

  if (token) {
    console.log('Token encontrado, redirigiendo a Home...');
    return <Navigate to="/Home" replace />;
  }

  console.log('No hay token, permitiendo acceso a login');
  return children;
};

export default RedirectIfAuthenticated;

