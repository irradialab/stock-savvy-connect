import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Boxes } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-inventory-light-blue p-6 text-center">
      <div className="max-w-3xl">
        <div className="inline-block p-4 bg-inventory-teal rounded-full mb-6">
          <Boxes className="h-12 w-12 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-inventory-blue mb-4">
          Welcome to Stock Savvy Connect
        </h1>
        <p className="text-xl md:text-2xl text-inventory-gray mb-8">
          The smart way to manage inventory and connect with suppliers
        </p>
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row justify-center">
          <Button asChild className="text-lg py-6 px-8 bg-inventory-teal hover:bg-inventory-teal/90">
            <Link to="/inventory">
              Access Dashboard
            </Link>
          </Button>
          <Button variant="outline" className="text-lg py-6 px-8">
            Learn More
          </Button>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            title="Real-time Inventory" 
            description="Monitor stock levels and receive low inventory alerts" 
          />
          <FeatureCard 
            title="Supplier Network" 
            description="Connect directly with trusted suppliers to fulfill your needs" 
          />
          <FeatureCard 
            title="Mobile Ready" 
            description="Access your inventory data from anywhere with our mobile app" 
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold text-inventory-blue mb-2">{title}</h3>
      <p className="text-inventory-gray">{description}</p>
    </div>
  );
};

export default Index;
