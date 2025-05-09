
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Product {
  id: string | number;
  name: string;
  description?: string;
  sku: string;
  unit_of_measure: string;
  price_paid?: number;
  unit_price?: number;
  discount?: number;
  last_purchase_date?: string;
}

interface SupplierProductListProps {
  products: Product[];
  showDiscount: boolean;
  supplierName: string;
  supplierId: string | number;
  onAddToCart: (product: Product, supplierName: string, supplierId: string | number) => void;
}

const SupplierProductList = ({ 
  products, 
  showDiscount, 
  supplierName,
  supplierId,
  onAddToCart 
}: SupplierProductListProps) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-4 text-gray-400">
        No products available.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-inventory-teal/30">
            <TableHead className="text-gray-300">Product</TableHead>
            <TableHead className="text-gray-300">SKU</TableHead>
            <TableHead className="text-gray-300">Unit</TableHead>
            <TableHead className="text-gray-300">Price</TableHead>
            {showDiscount && (
              <>
                <TableHead className="text-gray-300">Discount</TableHead>
                <TableHead className="text-gray-300">Last Ordered</TableHead>
              </>
            )}
            <TableHead className="w-[100px] text-gray-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} className="border-inventory-teal/20">
              <TableCell className="text-gray-300">
                <div>
                  {product.name}
                  {product.description && (
                    <div className="text-xs text-gray-400 mt-1">{product.description}</div>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-gray-300">{product.sku}</TableCell>
              <TableCell className="text-gray-300">{product.unit_of_measure}</TableCell>
              <TableCell className="text-white">
                ${(product.price_paid || product.unit_price || 0).toFixed(2)}
              </TableCell>
              {showDiscount && (
                <>
                  <TableCell className="text-white">
                    {product.discount ? `${(product.discount * 100).toFixed(0)}%` : '-'}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {product.last_purchase_date 
                      ? formatDate(new Date(product.last_purchase_date)) 
                      : '-'}
                  </TableCell>
                </>
              )}
              <TableCell>
                <Button
                  size="sm"
                  onClick={() => onAddToCart(product, supplierName, supplierId)}
                  className="text-xs bg-inventory-teal hover:bg-inventory-teal/90 text-white shadow-[0_0_10px_rgba(51,195,240,0.2)]"
                >
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  Order
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SupplierProductList;
