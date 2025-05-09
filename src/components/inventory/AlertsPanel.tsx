import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toStringValue } from "@/lib/utils";

interface Product {
  product_id: string;
  name: string;
  current_stock: number;
  unit_of_measure: string;
  sku: string;
  needs_reorder_flag: boolean;
  last_supplier?: {
    name: string;
    price_paid: number;
  };
}

interface AlertsPanelProps {
  companyId: number | null;
}

const AlertsPanel = ({ companyId }: AlertsPanelProps) => {
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!companyId) return;

    const fetchLowStockProducts = async () => {
      setLoading(true);
      try {
        // Obtener productos con stock bajo
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('company_id', companyId)
          .eq('needs_reorder_flag', true);

        if (productsError) {
          console.error('Error fetching low stock products:', productsError);
          return;
        }

        // Obtener información del último proveedor para cada producto
        const productIds = products?.map(p => p.product_id) || [];
        const { data: supplierInfo, error: supplierError } = await supabase
          .from('company_product_supplier_info')
          .select(`
            product_id,
            price_paid,
            suppliers:supplier_id (
              name
            )
          `)
          .eq('company_id', companyId)
          .in('product_id', productIds);

        if (supplierError) {
          console.error('Error fetching supplier info:', supplierError);
          return;
        }

        // Combinar la información de productos con la de proveedores
        const formattedData = products?.map(product => {
          const supplier = supplierInfo?.find(s => s.product_id === product.product_id);
          return {
            ...product,
            product_id: toStringValue(product.product_id),
            last_supplier: supplier ? {
              name: supplier.suppliers?.name,
              price_paid: supplier.price_paid
            } : undefined
          };
        }) || [];

        setLowStockProducts(formattedData);
      } catch (error) {
        console.error('Error in low stock products fetch:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLowStockProducts();
  }, [companyId]);

  const handleAddToCart = (product: Product) => {
    const cartItem = {
      id: product.product_id,
      name: product.name,
      quantity: 1,
      unitPrice: product.last_supplier?.price_paid || 0,
      sku: product.sku,
      unit_of_measure: product.unit_of_measure,
      supplier: product.last_supplier?.name
    };
    
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = currentCart.findIndex((item: any) => item.id === product.product_id);
    
    if (existingItemIndex >= 0) {
      currentCart[existingItemIndex].quantity += 1;
    } else {
      currentCart.push(cartItem);
    }
    
    localStorage.setItem('cart', JSON.stringify(currentCart));
    navigate('/orders');
  };

  if (loading) {
    return <div className="text-center py-4 text-gray-300">Loading alerts...</div>;
  }

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="text-center py-4 text-gray-400">Loading alerts...</div>
      ) : (
        <>
          {lowStockProducts.length === 0 ? (
            <div className="text-center py-4 text-gray-400">No low stock alerts</div>
          ) : (
            <div className="space-y-4">
              {/* Productos con stock 0 */}
              {lowStockProducts.filter(p => p.current_stock === 0).length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-red-400 mb-2">Out of Stock</h3>
                  <div className="space-y-2">
                    {lowStockProducts
                      .filter(p => p.current_stock === 0)
                      .map((product) => (
                        <div
                          key={product.product_id}
                          className="p-2 rounded-md bg-red-900/20 border border-red-500/30 flex justify-between items-start"
                        >
                          <div>
                            <div className="font-medium text-red-300">{product.name}</div>
                            <div className="text-sm text-red-400">SKU: {product.sku}</div>
                            {product.last_supplier && (
                              <div className="text-sm text-red-400 mt-1">
                                Last Supplier: {product.last_supplier.name}
                              </div>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleAddToCart(product)}
                            className="text-red-300 hover:text-white hover:bg-red-500/20"
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                        </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Productos con stock bajo pero mayor a 0 */}
              {lowStockProducts.filter(p => p.current_stock > 0).length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-amber-400 mb-2">Low Stock Warning</h3>
                  <div className="space-y-2">
                    {lowStockProducts
                      .filter(p => p.current_stock > 0)
                      .map((product) => (
                        <div
                          key={product.product_id}
                          className="p-2 rounded-md bg-amber-900/20 border border-amber-500/30 flex justify-between items-start"
                        >
                          <div>
                            <div className="font-medium text-amber-300">{product.name}</div>
                            <div className="text-sm text-amber-400">
                              Current Stock: {product.current_stock} {product.unit_of_measure}
                            </div>
                            <div className="text-xs text-amber-500">SKU: {product.sku}</div>
                            {product.last_supplier && (
                              <div className="text-sm text-amber-400 mt-1">
                                Last Supplier: {product.last_supplier.name}
                              </div>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleAddToCart(product)}
                            className="text-amber-300 hover:text-white hover:bg-amber-500/20"
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                        </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AlertsPanel;
