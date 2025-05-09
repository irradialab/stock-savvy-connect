
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  supplier: string;
}

const Orders = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState("cart");

  const handleQuantityChange = (id: string, change: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
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

      <Tabs defaultValue="cart" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="bg-black/60 border border-inventory-teal/30">
          <TabsTrigger value="cart" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-inventory-teal">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Shopping Cart
          </TabsTrigger>
          <TabsTrigger value="orders" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-inventory-teal">
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
                          <TableCell className="text-gray-300">{item.name}</TableCell>
                          <TableCell className="text-gray-300">{item.supplier}</TableCell>
                          <TableCell className="text-gray-300">${item.unitPrice.toFixed(2)}</TableCell>
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
                                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) - item.quantity)}
                                className="w-20 text-center bg-black/60 border-inventory-teal/40 text-white"
                                min="0"
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
                          <TableCell className="text-white">${(item.quantity * item.unitPrice).toFixed(2)}</TableCell>
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
                      <Button variant="outline" className="border-inventory-teal/40 bg-black/60 text-gray-300 hover:bg-inventory-teal/20">Save for Later</Button>
                      <Button className="bg-inventory-teal hover:bg-inventory-teal/90 text-white shadow-[0_0_10px_rgba(51,195,240,0.4)]">Place Order</Button>
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
              <div className="text-center py-8 text-gray-400">
                No purchase orders found. Create a new order from your shopping cart.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Orders;
