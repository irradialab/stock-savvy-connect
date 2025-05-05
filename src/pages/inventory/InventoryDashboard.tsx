
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardCard from "@/components/inventory/DashboardCard";
import InventoryStatus from "@/components/inventory/InventoryStatus";
import AlertsPanel from "@/components/inventory/AlertsPanel";
import ActivityFeed from "@/components/inventory/ActivityFeed";
import SupplierConnect from "@/components/inventory/SupplierConnect";
import InventoryStats from "@/components/inventory/InventoryStats";
import { Download, Filter, Plus, RefreshCcw } from "lucide-react";

const InventoryDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-inventory-blue">Inventory Dashboard</h1>
          <p className="text-sm text-inventory-gray mt-1">
            Monitor and manage your company's inventory in real-time
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" className="h-9">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm" variant="outline" className="h-9">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" className="h-9 bg-inventory-teal hover:bg-inventory-teal/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      <InventoryStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DashboardCard title="Inventory Status">
            <div className="flex justify-between items-center mb-4">
              <Tabs defaultValue="all" className="w-full">
                <TabsList>
                  <TabsTrigger value="all">All Items</TabsTrigger>
                  <TabsTrigger value="low">Low Stock</TabsTrigger>
                  <TabsTrigger value="electronics">Electronics</TabsTrigger>
                  <TabsTrigger value="storage">Storage</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button size="sm" variant="ghost" className="ml-2">
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
            <InventoryStatus />
          </DashboardCard>

          <DashboardCard title="Recent Activity">
            <ActivityFeed />
          </DashboardCard>
        </div>

        <div className="space-y-6">
          <DashboardCard title="Low Stock Alerts">
            <AlertsPanel />
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
