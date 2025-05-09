import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardCard from "@/components/inventory/DashboardCard";
import InventoryStatus from "@/components/inventory/InventoryStatus";
import AlertsPanel from "@/components/inventory/AlertsPanel";
import ActivityFeed from "@/components/inventory/ActivityFeed";
import SupplierConnect from "@/components/inventory/SupplierConnect";
import InventoryStats from "@/components/inventory/InventoryStats";
import CompanySelector from "@/components/inventory/CompanySelector";
import { Download, Filter, LogOut, Plus, RefreshCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const InventoryDashboard = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchInitialCompany = async () => {
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('company_id')
          .limit(1)
          .single();

        if (error) {
          console.error('Error loading initial company:', error);
          return;
        }

        if (data) {
          setSelectedCompanyId(data.company_id);
        }
      } catch (error) {
        console.error('Error loading initial company:', error);
      }
    };

    fetchInitialCompany();
  }, []);

  const handleCompanyChange = (companyId: number) => {
    setSelectedCompanyId(companyId);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the system"
    });
    navigate('/');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white text-glow-strong">Inventory Dashboard</h1>
          <p className="text-sm text-gray-300 mt-1">
            Monitor and manage your company's inventory in real-time
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <CompanySelector onCompanyChange={handleCompanyChange} />
          <Button size="sm" variant="outline" className="h-9 border-inventory-teal/40 bg-black/60 text-gray-300 hover:bg-inventory-teal/20 hover:text-white">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm" variant="outline" className="h-9 border-inventory-teal/40 bg-black/60 text-gray-300 hover:bg-inventory-teal/20 hover:text-white">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" className="h-9 bg-inventory-teal hover:bg-inventory-teal/90 text-white shadow-[0_0_10px_rgba(51,195,240,0.4)]">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
          <Button size="sm" variant="destructive" className="h-9" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <InventoryStats companyId={selectedCompanyId} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DashboardCard title="Inventory" className="border-inventory-teal/30 bg-black/70 backdrop-blur-md">
            <div className="flex justify-end items-center mb-4">
              <Button size="sm" variant="ghost" className="text-gray-300 hover:text-white hover:bg-inventory-teal/20">
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
            <InventoryStatus companyId={selectedCompanyId} activeTab={activeTab} />
          </DashboardCard>

          <DashboardCard title="Recent Activity" className="border-inventory-teal/30 bg-black/70 backdrop-blur-md">
            <ActivityFeed />
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
