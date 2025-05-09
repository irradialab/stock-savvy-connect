
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Check if there's a user in localStorage
    const user = localStorage.getItem('user');
    setIsAuthenticated(!!user);
  }, []);

  // While verifying authentication, show a spinner
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-inventory-teal shadow-[0_0_15px_rgba(51,195,240,0.7)]"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If authenticated, show protected content
  return <>{children}</>;
};

export default AuthGuard;
