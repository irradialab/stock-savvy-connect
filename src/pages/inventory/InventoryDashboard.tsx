
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
          <h1 className="text-2xl font-bold text-inventory-teal">Inventory Dashboard</h1>
          <p className="text-sm text-inventory-light-blue mt-1">
            Monitor and manage your company's inventory in real-time
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <CompanySelector onCompanyChange={handleCompanyChange} />
          <Button size="sm" variant="outline" className="h-9 border-inventory-teal/30 bg-black/40 text-inventory-light-blue hover:bg-inventory-teal/20">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm" variant="outline" className="h-9 border-inventory-teal/30 bg-black/40 text-inventory-light-blue hover:bg-inventory-teal/20">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" className="h-9 bg-inventory-teal hover:bg-inventory-teal/90 shadow-[0_0_10px_rgba(51,195,240,0.4)]">
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
          <DashboardCard title="Inventory">
            <div className="flex justify-between items-center mb-4">
              <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="bg-black/50 border border-inventory-teal/20">
                  <TabsTrigger 
                    value="all"
                    className="data-[state=active]:bg-inventory-teal data-[state=active]:text-white"
                  >
                    All Products
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Button size="sm" variant="ghost" className="ml-2 text-inventory-light-blue hover:bg-inventory-teal/20">
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
            <InventoryStatus companyId={selectedCompanyId} activeTab={activeTab} />
          </DashboardCard>

          <DashboardCard title="Recent Activity">
            <ActivityFeed />
          </DashboardCard>
        </div>

        <div className="space-y-6">
          <DashboardCard title="Low Stock Alerts">
            <AlertsPanel companyId={selectedCompanyId} />
          </DashboardCard>

          <DashboardCard title="Connect with Suppliers">
            <SupplierConnect />
          </DashboardCard>
        </div>
      </div>
    </div>
  );
};

export default InventoryDashboard;
