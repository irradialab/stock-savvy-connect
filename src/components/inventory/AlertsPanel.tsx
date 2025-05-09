
import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface InventoryAlert {
  product_id: string;
  name: string;
  current_stock: number;
  predicted_days_left: number;
  unit_of_measure: string;
  sku: string;
}

interface AlertsPanelProps {
  companyId: number | null;
}

const AlertsPanel = ({ companyId }: AlertsPanelProps) => {
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) return;

    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('product_id, name, current_stock, predicted_days_left, unit_of_measure, sku')
          .eq('company_id', companyId)
          .eq('predicted_days_left', 0);

        if (error) {
          console.error('Error loading alerts:', error);
          return;
        }

        setAlerts(data || []);
      } catch (error) {
        console.error('Error loading alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [companyId]);

  if (loading) {
    return <div className="text-center py-4 text-gray-300">Loading alerts...</div>;
  }

  return (
    <div className="space-y-4">
      {alerts.length === 0 ? (
        <div className="text-center py-4 text-gray-300">No alerts at this time</div>
      ) : (
        <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
          {alerts.map((alert) => (
            <Alert 
              key={alert.product_id} 
              className="bg-red-900/40 border border-red-500/50 text-white shadow-[0_0_10px_rgba(239,68,68,0.2)]"
            >
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <AlertTitle className="text-sm font-semibold text-red-300">
                Out of Stock: {alert.name}
              </AlertTitle>
              <AlertDescription className="text-xs space-y-2 text-gray-200">
                <div>SKU: {alert.sku}</div>
                <div>Current stock: {alert.current_stock} {alert.unit_of_measure}</div>
                <div className="font-semibold text-red-300">Immediate reorder required!</div>
                <Button 
                  size="sm" 
                  className="mt-2 bg-red-600 hover:bg-red-700 text-white shadow-[0_0_10px_rgba(239,68,68,0.3)]"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Order Product
                </Button>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertsPanel;
