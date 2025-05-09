
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Plus, Minus, Trash2, ShoppingBag, Package } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  sku: string;
  unit_of_measure: string;
  supplier?: string;
  supplier_id?: string;
}

interface Supplier {
  supplier_id: string;
  name: string;
  price_paid?: number;
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  total: number;
  items: CartItem[];
}

const Orders = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState("cart");
  const [suppliers, setSuppliers] = useState<Record<string, Supplier[]>>({});
  const [pastOrders, setPastOrders] = useState<Order[]>([]);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const navigate = useNavigate();

  // Fetch company ID from localStorage
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setCompanyId(userData.company_id);
    }
  }, []);

  // Load cart items from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Load suppliers for products in cart
  useEffect(() => {
    const loadSupplierInfo = async () => {
      if (!companyId || cartItems.length === 0) return;
      
      try {
        // Get all product IDs in cart
        const productIds = cartItems.map(item => item.id);
        
        // Fetch supplier information for these products
        const { data, error } = await supabase
          .from('company_product_supplier_info')
          .select(`
            product_id,
            price_paid,
            supplier_id,
            suppliers:supplier_id (
              supplier_id,
              name
            )
          `)
          .eq('company_id', companyId)
          .in('product_id', productIds);
          
        if (error) {
          console.error('Error fetching supplier info:', error);
          return;
        }
        
        // Organize suppliers by product_id
        const suppliersByProduct: Record<string, Supplier[]> = {};
        
        data.forEach(info => {
          const productId = info.product_id as string;
          if (!suppliersByProduct[productId]) {
            suppliersByProduct[productId] = [];
          }
          
          suppliersByProduct[productId].push({
            supplier_id: info.supplier_id as string,
            name: info.suppliers?.name as string,
            price_paid: info.price_paid as number
          });
        });
        
        setSuppliers(suppliersByProduct);
        
        // Update cart items with supplier info if available
        setCartItems(prevItems => 
          prevItems.map(item => {
            const productSuppliers = suppliersByProduct[item.id];
            if (productSuppliers?.length > 0) {
              // Use the first supplier as default
              const defaultSupplier = productSuppliers[0];
              return {
                ...item,
                supplier: defaultSupplier.name,
                supplier_id: defaultSupplier.supplier_id,
                unitPrice: defaultSupplier.price_paid || 0
              };
            }
            return item;
          })
        );
        
      } catch (error) {
        console.error('Error in supplier fetching:', error);
      }
    };
    
    loadSupplierInfo();
  }, [companyId, cartItems]);

  // Save cart changes to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleQuantityChange = (id: string, change: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const handleSetQuantity = (id: string, value: number) => {
    const quantity = Math.max(1, value); // Ensure minimum of 1
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleSupplierChange = (productId: string, supplierId: string) => {
    const productSuppliers = suppliers[productId] || [];
    const selectedSupplier = productSuppliers.find(s => s.supplier_id === supplierId);
    
    if (selectedSupplier) {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId
            ? { 
                ...item, 
                supplier: selectedSupplier.name,
                supplier_id: selectedSupplier.supplier_id,
                unitPrice: selectedSupplier.price_paid || 0
              }
            : item
        )
      );
    }
  };

  const removeFromCart = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    toast.success("Product removed from cart");
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Validate all items have suppliers
    const missingSupplier = cartItems.some(item => !item.supplier_id);
    if (missingSupplier) {
      toast.error("Some products don't have supplier information", {
        description: "Please make sure all products have suppliers selected"
      });
      return;
    }

    try {
      toast.success("Order placed successfully", {
        description: "Your order has been submitted"
      });
      
      // Clear the cart
      setCartItems([]);
      localStorage.removeItem('cart');
      
      // Switch to orders tab
      setActiveTab("orders");
      
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error("Failed to place order", {
        description: "Please try again later"
      });
    }
  };

  const handleClearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    toast.info("Cart cleared");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white text-glow-strong">Orders</h1>
          <p className="text-sm text-gray-300 mt-1">
            Manage your purchase orders and shopping cart
          </p>
        </div>
      </div>

      <Tabs defaultValue="cart" className="w-full" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="bg-black/60 border border-inventory-teal/30">
          <TabsTrigger value="cart" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-inventory-teal">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Shopping Cart
          </TabsTrigger>
          <TabsTrigger value="orders" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-inventory-teal">
            <Package className="h-4 w-4 mr-2" />
            Purchase Orders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cart" className="space-y-4">
          <Card className="border-inventory-teal/30 bg-black/70 backdrop-blur-md">
            <CardHeader className="border-b border-inventory-teal/20">
              <CardTitle className="text-white text-glow-subtle">Shopping Cart</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  Your cart is empty. Add products from the inventory to start ordering.
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-inventory-teal/30">
                        <TableHead className="text-gray-300">Product</TableHead>
                        <TableHead className="text-gray-300">SKU</TableHead>
                        <TableHead className="text-gray-300">Supplier</TableHead>
                        <TableHead className="text-gray-300">Unit Price</TableHead>
                        <TableHead className="text-gray-300">Quantity</TableHead>
                        <TableHead className="text-gray-300">Total</TableHead>
                        <TableHead className="w-[100px] text-gray-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cartItems.map((item) => (
                        <TableRow key={item.id} className="border-inventory-teal/20">
                          <TableCell className="text-gray-300">
                            <div>
                              {item.name}
                              <div className="text-xs text-gray-400">{item.unit_of_measure}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-300">{item.sku}</TableCell>
                          <TableCell>
                            {suppliers[item.id]?.length > 0 ? (
                              <Select
                                value={item.supplier_id || ""}
                                onValueChange={(value) => handleSupplierChange(item.id, value)}
                              >
                                <SelectTrigger className="w-[150px] bg-black/60 border-inventory-teal/40 text-gray-200">
                                  <SelectValue placeholder="Select supplier" />
                                </SelectTrigger>
                                <SelectContent>
                                  {suppliers[item.id]?.map((supplier) => (
                                    <SelectItem key={supplier.supplier_id} value={supplier.supplier_id}>
                                      {supplier.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <span className="text-amber-400">No suppliers found</span>
                            )}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            ${item.unitPrice ? item.unitPrice.toFixed(2) : "0.00"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuantityChange(item.id, -1)}
                                className="border-inventory-teal/40 bg-black/60 text-gray-300 hover:bg-inventory-teal/20"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleSetQuantity(item.id, parseInt(e.target.value) || 1)}
                                className="w-20 text-center bg-black/60 border-inventory-teal/40 text-white"
                                min="1"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuantityChange(item.id, 1)}
                                className="border-inventory-teal/40 bg-black/60 text-gray-300 hover:bg-inventory-teal/20"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-white">
                            ${(item.quantity * item.unitPrice).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-900/30"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div className="flex justify-between items-center mt-6">
                    <div className="text-lg font-semibold text-white">
                      Total: ${calculateTotal().toFixed(2)}
                    </div>
                    <div className="space-x-2">
                      <Button 
                        variant="outline" 
                        className="border-inventory-teal/40 bg-black/60 text-gray-300 hover:bg-red-900/20 hover:text-red-300"
                        onClick={handleClearCart}
                      >
                        Clear Cart
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-inventory-teal/40 bg-black/60 text-gray-300 hover:bg-inventory-teal/20"
                        onClick={() => navigate('/inventory')}
                      >
                        Continue Shopping
                      </Button>
                      <Button 
                        className="bg-inventory-teal hover:bg-inventory-teal/90 text-white shadow-[0_0_10px_rgba(51,195,240,0.4)]"
                        onClick={handlePlaceOrder}
                      >
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Place Order
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card className="border-inventory-teal/30 bg-black/70 backdrop-blur-md">
            <CardHeader className="border-b border-inventory-teal/20">
              <CardTitle className="text-white text-glow-subtle">Purchase Orders</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {pastOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No purchase orders found. Create a new order from your shopping cart.
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Order history would go here */}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Orders;
