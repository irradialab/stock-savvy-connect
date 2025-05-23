import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowUpDown, ShoppingCart } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { toStringValue } from "@/lib/utils";

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

type StockStatus = 'all' | 'normal' | 'low';

const InventoryStatus = ({ companyId, activeTab }: InventoryStatusProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockStatus, setStockStatus] = useState<StockStatus>('all');
  const [sortField, setSortField] = useState<keyof Product>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const navigate = useNavigate();

  useEffect(() => {
    if (!companyId) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('company_id', companyId);

        if (error) {
          console.error('Error al cargar productos:', error);
          return;
        }

        // Convert product_id from number to string to match the Product interface
        const formattedData = data?.map(product => ({
          ...product,
          product_id: toStringValue(product.product_id)
        })) || [];

        setProducts(formattedData);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [companyId]);

  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleAddToCart = (product: Product) => {
    // Store the product in localStorage to pass it to the cart
    const cartItem = {
      id: product.product_id, // Now this is already a string
      name: product.name,
      quantity: 1,
      unitPrice: 0, // This will be updated from supplier info
      sku: product.sku,
      unit_of_measure: product.unit_of_measure
    };
    
    // Get current cart items or initialize empty array
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already exists in cart
    const existingItemIndex = currentCart.findIndex((item: any) => item.id === product.product_id);
    
    if (existingItemIndex >= 0) {
      // Product exists, increase quantity
      currentCart[existingItemIndex].quantity += 1;
      toast.success("Product quantity updated in cart", {
        description: `${product.name} quantity increased`
      });
    } else {
      // Add new product to cart
      currentCart.push(cartItem);
      toast.success("Product added to cart", {
        description: `${product.name} added to your order`
      });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(currentCart));
    
    // Navigate to orders page
    navigate('/orders');
  };

  const filteredProducts = products
    .filter(product => {
      // Filtro por búsqueda
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro por estado
      const matchesStatus = 
        stockStatus === 'all' ||
        (stockStatus === 'low' && product.needs_reorder_flag) ||
        (stockStatus === 'normal' && !product.needs_reorder_flag);

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue === null) return 1;
      if (bValue === null) return -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortDirection === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

  if (loading) {
    return <div className="py-4 text-center">Cargando productos...</div>;
  }

  if (products.length === 0) {
    return <div className="py-4 text-center">No hay productos disponibles</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, SKU or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select
          value={stockStatus}
          onValueChange={(value: StockStatus) => setStockStatus(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="normal">Normal Stock</SelectItem>
            <SelectItem value="low">Low Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-1"
                >
                  Product
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('sku')}
                  className="flex items-center gap-1"
                >
                  SKU
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('current_stock')}
                  className="flex items-center gap-1"
                >
                  Current Stock
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('unit_of_measure')}
                  className="flex items-center gap-1"
                >
                  Unit
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('predicted_days_left')}
                  className="flex items-center gap-1"
                >
                  Predicted Left Days
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.product_id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{product.current_stock}</TableCell>
                <TableCell>{product.unit_of_measure}</TableCell>
                <TableCell>
                  {product.predicted_days_left !== null 
                    ? `${product.predicted_days_left} días`
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    product.needs_reorder_flag
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {product.needs_reorder_flag ? 'Low' : 'Normal'}
                  </span>
                </TableCell>
                <TableCell>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleAddToCart(product)}
                    className="text-inventory-teal hover:bg-inventory-teal/20 hover:text-white"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InventoryStatus;
