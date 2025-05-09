
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Boxes } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already authenticated
    const user = localStorage.getItem('user');
    setIsAuthenticated(!!user);
    
    // If already authenticated, redirect to dashboard
    if (user) {
      navigate('/inventory');
    }
  }, [navigate]);

  // While verifying authentication
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-inventory-teal shadow-[0_0_15px_rgba(51,195,240,0.7)]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-black text-white">
      {/* Login Section (right on desktop, top on mobile) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 backdrop-blur-md bg-black/40">
        <LoginForm />
      </div>
      
      {/* Presentation Section (left on desktop, bottom on mobile) */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 bg-gradient-to-r from-black to-inventory-blue/30 backdrop-blur-sm text-center">
        <div className="max-w-xl">
          <div className="inline-block p-4 bg-inventory-teal rounded-full mb-6 shadow-[0_0_15px_rgba(51,195,240,0.8)]">
            <Boxes className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight text-glow-strong">
            Stock Savvy Connect
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            AI-Powered Inventory Management System
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard 
              title="Real-Time Inventory" 
              description="Monitor stock levels and receive low inventory alerts" 
            />
            <FeatureCard 
              title="Supplier Network" 
              description="Connect directly with trusted suppliers" 
            />
            <FeatureCard 
              title="AI Predictions" 
              description="Optimize orders with intelligent forecasting" 
            />
            <FeatureCard 
              title="Mobile Access" 
              description="Access your inventory data from anywhere" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="bg-black/60 backdrop-blur-md border border-inventory-teal/40 p-6 rounded-lg hover:shadow-[0_0_15px_rgba(51,195,240,0.4)] transition-all duration-300 hover:-translate-y-1">
      <h3 className="text-lg font-semibold text-inventory-teal mb-2 text-glow-subtle">{title}</h3>
      <p className="text-gray-300 text-sm">{description}</p>
    </div>
  );
};

export default Index;
