
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Boxes } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificamos si el usuario ya está autenticado
    const user = localStorage.getItem('user');
    setIsAuthenticated(!!user);
    
    // Si ya está autenticado, redirigimos al dashboard
    if (user) {
      navigate('/inventory');
    }
  }, [navigate]);

  // Mientras verificamos la autenticación
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-inventory-teal"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sección de Login (derecha en desktop, arriba en móvil) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-inventory-light-blue">
        <LoginForm />
      </div>
      
      {/* Sección de Presentación (izquierda en desktop, abajo en móvil) */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 bg-white text-center">
        <div className="max-w-xl">
          <div className="inline-block p-4 bg-inventory-teal rounded-full mb-6">
            <Boxes className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-inventory-blue mb-4">
            Stock Savvy Connect
          </h1>
          <p className="text-xl md:text-2xl text-inventory-gray mb-8">
            Sistema inteligente para gestionar inventario con IA
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard 
              title="Inventario en Tiempo Real" 
              description="Monitoree niveles de stock y reciba alertas de inventario bajo" 
            />
            <FeatureCard 
              title="Red de Proveedores" 
              description="Conéctese directamente con proveedores de confianza" 
            />
            <FeatureCard 
              title="Predicciones con IA" 
              description="Optimice sus pedidos con predicciones inteligentes" 
            />
            <FeatureCard 
              title="Acceso Móvil" 
              description="Acceda a sus datos de inventario desde cualquier lugar" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="bg-inventory-light-blue p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-inventory-blue mb-2">{title}</h3>
      <p className="text-inventory-gray text-sm">{description}</p>
    </div>
  );
};

export default Index;
