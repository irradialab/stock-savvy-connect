
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardCard from "@/components/inventory/DashboardCard";
import InventoryStatus from "@/components/inventory/InventoryStatus";
import AlertsPanel from "@/components/inventory/AlertsPanel";
import ActivityFeed from "@/components/inventory/ActivityFeed";
import SupplierConnect from "@/components/inventory/SupplierConnect";
import InventoryStats from "@/components/inventory/InventoryStats";
import CompanySelector from "@/components/inventory/CompanySelector";
import { Download, Filter, Plus, RefreshCcw } from "lucide-react";

const InventoryDashboard = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);

  const handleCompanyChange = (companyId: number) => {
    setSelectedCompanyId(companyId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-inventory-blue">Panel de Inventario</h1>
          <p className="text-sm text-inventory-gray mt-1">
            Monitorea y gestiona el inventario de tu empresa en tiempo real
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <CompanySelector onCompanyChange={handleCompanyChange} />
          <Button size="sm" variant="outline" className="h-9">
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
          <Button size="sm" variant="outline" className="h-9">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button size="sm" className="h-9 bg-inventory-teal hover:bg-inventory-teal/90">
            <Plus className="h-4 w-4 mr-2" />
            Añadir Producto
          </Button>
        </div>
      </div>

      <InventoryStats companyId={selectedCompanyId} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DashboardCard title="Estado del Inventario">
            <div className="flex justify-between items-center mb-4">
              <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">Todos los Productos</TabsTrigger>
                  <TabsTrigger value="low">Bajo Stock</TabsTrigger>
                  <TabsTrigger value="electronics">Electrónicos</TabsTrigger>
                  <TabsTrigger value="storage">Almacenamiento</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button size="sm" variant="ghost" className="ml-2">
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
            <InventoryStatus companyId={selectedCompanyId} activeTab={activeTab} />
          </DashboardCard>

          <DashboardCard title="Actividad Reciente">
            <ActivityFeed />
          </DashboardCard>
        </div>

        <div className="space-y-6">
          <DashboardCard title="Alertas de Bajo Stock">
            <AlertsPanel />
          </DashboardCard>

          <DashboardCard title="Conectar con Proveedores">
            <SupplierConnect />
          </DashboardCard>
        </div>
      </div>
    </div>
  );
};

export default InventoryDashboard;
