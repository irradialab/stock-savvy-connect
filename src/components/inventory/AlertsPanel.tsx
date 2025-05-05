
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface InventoryAlert {
  id: number;
  itemName: string;
  currentStock: number;
  threshold: number;
  createdAt: string;
}

const AlertsPanel = () => {
  const alerts: InventoryAlert[] = [
    { 
      id: 1, 
      itemName: "Graphics Cards", 
      currentStock: 58, 
      threshold: 60, 
      createdAt: "2023-06-01T09:30:00" 
    },
    { 
      id: 2, 
      itemName: "SSDs", 
      currentStock: 87, 
      threshold: 100, 
      createdAt: "2023-06-02T14:45:00" 
    },
    { 
      id: 3, 
      itemName: "Motherboards", 
      currentStock: 12, 
      threshold: 30, 
      createdAt: "2023-06-03T16:20:00" 
    },
  ];

  return (
    <div className="space-y-4">
      {alerts.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No alerts at this time</div>
      ) : (
        alerts.map((alert) => (
          <Alert key={alert.id} variant="destructive" className="bg-red-50 border-red-200 text-red-800">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle className="text-sm font-semibold">Low Stock Alert: {alert.itemName}</AlertTitle>
            <AlertDescription className="text-xs">
              Current stock: {alert.currentStock} (below threshold of {alert.threshold})
            </AlertDescription>
          </Alert>
        ))
      )}
    </div>
  );
};

export default AlertsPanel;
