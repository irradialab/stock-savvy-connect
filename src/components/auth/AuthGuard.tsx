
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Add a small delay to ensure localStorage is properly checked
    const checkAuth = async () => {
      try {
        // Check if there's a user in localStorage
        const user = localStorage.getItem('user');
        setIsAuthenticated(!!user);
      } catch (error) {
        console.error("Authentication check error:", error);
        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    
    checkAuth();
  }, []);

  // While verifying authentication, show a spinner
  if (isCheckingAuth || isAuthenticated === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-t-2 border-inventory-teal shadow-[0_0_25px_rgba(51,195,240,1)]"></div>
        <p className="mt-6 text-inventory-teal text-lg font-medium text-glow animate-pulse">
          Verifying authentication status...
        </p>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to login page");
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If authenticated, show protected content
  return <>{children}</>;
};

export default AuthGuard;
