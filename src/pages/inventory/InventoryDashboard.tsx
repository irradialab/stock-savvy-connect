import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import DashboardCard from "@/components/inventory/DashboardCard";
import InventoryStatus from "@/components/inventory/InventoryStatus";
import AlertsPanel from "@/components/inventory/AlertsPanel";
import SupplierConnect from "@/components/inventory/SupplierConnect";
import InventoryStats from "@/components/inventory/InventoryStats";
import { Download, Filter, LogOut, Plus, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const InventoryDashboard = () => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const [companyName, setCompanyName] = useState<string>('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/');
      return;
    }

    try {
      const userData = JSON.parse(user);
      if (userData.company_id) {
        setSelectedCompanyId(userData.company_id);
        // Obtener el nombre de la compañía
        const fetchCompanyName = async () => {
          const { data, error } = await supabase
            .from('companies')
            .select('name')
            .eq('company_id', userData.company_id)
            .single();

          if (error) {
            console.error('Error fetching company name:', error);
            return;
          }

          if (data) {
            setCompanyName(data.name);
          }
        };

        fetchCompanyName();
      } else {
        toast({
          title: "Error",
          description: "No company associated with your account",
          variant: "destructive"
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/');
    }
  }, [navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the system"
    });
    navigate('/');
  };

  const handleRefresh = () => {
    // Implementation of handleRefresh function
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white text-glow-strong">{companyName}</h1>
          <p className="text-lg text-gray-300 mt-1">
            Bienvenido, {localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).email : 'Usuario'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-inventory-teal/40 bg-black/60 text-gray-300 hover:bg-inventory-teal/20"
            onClick={handleRefresh}
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh Products
          </Button>
          <Button
            variant="destructive"
            className="bg-red-600 hover:bg-red-700"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <InventoryStats companyId={selectedCompanyId} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardCard title="Inventory" className="border-inventory-teal/30 bg-black/70 backdrop-blur-md">
            <div className="flex justify-end items-center mb-4">
              <Button size="sm" variant="ghost" className="text-gray-300 hover:text-white hover:bg-inventory-teal/20">
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
            <InventoryStatus companyId={selectedCompanyId} activeTab="all" />
          </DashboardCard>
        </div>

        <div className="space-y-6">
          <DashboardCard title="Low Stock Alerts" className="border-inventory-teal/30 bg-black/70 backdrop-blur-md">
            <AlertsPanel companyId={selectedCompanyId} />
          </DashboardCard>

          <DashboardCard title="Connect with Suppliers" className="border-inventory-teal/30 bg-black/70 backdrop-blur-md">
            <SupplierConnect />
          </DashboardCard>
        </div>
      </div>
    </div>
  );
};

export default InventoryDashboard;
