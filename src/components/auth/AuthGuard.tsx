
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Verificamos si hay un usuario en localStorage
    const user = localStorage.getItem('user');
    setIsAuthenticated(!!user);
  }, []);

  // Mientras verificamos la autenticación, mostramos un spinner
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-inventory-teal"></div>
      </div>
    );
  }

  // Si no está autenticado, redirigimos al inicio
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Si está autenticado, mostramos el contenido protegido
  return <>{children}</>;
};

export default AuthGuard;
