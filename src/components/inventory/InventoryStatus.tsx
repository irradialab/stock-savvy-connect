
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";

interface InventoryItemProps {
  name: string;
  currentStock: number;
  capacity: number;
  category: string;
  unitOfMeasure: string;
  needsReorder: boolean;
  predictedDaysLeft: number | null;
}

interface Product {
  product_id: string;
  name: string;
  current_stock: number;
  unit_of_measure: string;
  predicted_days_left: number | null;
  needs_reorder_flag: boolean;
  description: string;
  company_id: number;
  sku: string;
  reorder_threshold_days: number | null;
}

interface InventoryStatusProps {
  companyId: number | null;
  activeTab: string;
}

const InventoryStatus = ({ companyId, activeTab }: InventoryStatusProps) => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItemProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('products')
          .select('*')
          .eq('company_id', companyId);

        // Filtrar según la pestaña activa
        if (activeTab === 'low') {
          query = query.eq('needs_reorder_flag', true);
        } 
        // Se podrían añadir más filtros por categoría aquí

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching products:', error);
          return;
        }

        // Transformamos los productos a formato InventoryItem
        const items = (data || []).map((product: Product) => ({
          name: product.name || 'Producto sin nombre',
          currentStock: product.current_stock || 0,
          capacity: product.reorder_threshold_days ? product.current_stock + 50 : 100, // Estimación para la barra de progreso
          category: product.description || 'General',
          unitOfMeasure: product.unit_of_measure || 'unidad',
          needsReorder: product.needs_reorder_flag || false,
          predictedDaysLeft: product.predicted_days_left
        }));

        setInventoryItems(items);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [companyId, activeTab]);

  if (loading) {
    return <div className="py-4 text-center">Cargando inventario...</div>;
  }

  if (inventoryItems.length === 0) {
    return <div className="py-4 text-center">No hay productos disponibles</div>;
  }

  return (
    <div className="space-y-4">
      {inventoryItems.map((item, index) => (
        <InventoryItem key={index} {...item} />
      ))}
    </div>
  );
};

const InventoryItem = ({ 
  name, 
  currentStock, 
  capacity, 
  category, 
  unitOfMeasure,
  needsReorder,
  predictedDaysLeft 
}: InventoryItemProps) => {
  const percentage = Math.round((currentStock / capacity) * 100);
  
  let progressColor = "bg-inventory-success";
  if (percentage < 25 || needsReorder) {
    progressColor = "bg-inventory-danger";
  } else if (percentage < 50) {
    progressColor = "bg-inventory-warning";
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-medium text-sm">{name}</h4>
          <p className="text-xs text-gray-500">{category}</p>
        </div>
        <div className="text-sm">
          {currentStock} {unitOfMeasure}
          {needsReorder && (
            <span className="ml-2 text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">
              ¡Reordenar!
            </span>
          )}
          {predictedDaysLeft !== null && (
            <span className="ml-2 text-xs text-gray-500">
              ({predictedDaysLeft} días restantes)
            </span>
          )}
        </div>
      </div>
      <Progress value={percentage} className={`h-2 ${progressColor}`} />
    </div>
  );
};

export default InventoryStatus;
