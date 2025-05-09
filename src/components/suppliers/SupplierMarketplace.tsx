
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import SupplierProductList from "./SupplierProductList";

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

interface Supplier {
  supplier_id: string | number;
  name: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  type?: string;
  products: Product[];
  otherProducts: Product[];
}

interface SupplierMarketplaceProps {
  suppliers: Supplier[];
}

const SupplierMarketplace = ({ suppliers }: SupplierMarketplaceProps) => {
  const navigate = useNavigate();
  const [expandedSupplier, setExpandedSupplier] = useState<string | number | null>(null);

  const toggleSupplierDetails = (supplierId: string | number) => {
    setExpandedSupplier(expandedSupplier === supplierId ? null : supplierId);
  };

  // Generate a random rating between 3.5 and 5 for demonstration purposes
  const generateRating = (supplierId: string | number) => {
    // Use the supplier ID as a seed for consistent ratings
    const seed = typeof supplierId === 'string' 
      ? supplierId.split('').reduce((a, b) => a + b.charCodeAt(0), 0) 
      : supplierId;
    
    // Generate a number between 3.5 and 5
    return (3.5 + (seed % 15) / 10).toFixed(1);
  };

  // Render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 text-yellow-300 fill-yellow-300" />);
    }
    
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="h-4 w-4 text-yellow-300" />
          <Star className="absolute top-0 left-0 h-4 w-4 text-yellow-300 fill-yellow-300 overflow-hidden" 
               style={{ clipPath: 'inset(0 50% 0 0)' }} />
        </div>
      );
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-yellow-300" />);
    }
    
    return stars;
  };

  // Function to view supplier details
  const viewSupplierDetails = (supplierId: string | number) => {
    toggleSupplierDetails(supplierId);
  };

  // Function to handle adding product to cart
  const addToCart = (product: Product, supplierName: string, supplierId: string | number) => {
    try {
      // Get existing cart from localStorage
      const cartJSON = localStorage.getItem('cart');
      let cart = cartJSON ? JSON.parse(cartJSON) : [];
      
      // Check if product is already in cart
      const existingItemIndex = cart.findIndex((item: any) => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Increase quantity if already in cart
        cart[existingItemIndex].quantity += 1;
        toast.success(`Increased ${product.name} quantity in cart`);
      } else {
        // Add new item to cart
        cart.push({
          id: product.id,
          name: product.name,
          sku: product.sku,
          unit_of_measure: product.unit_of_measure,
          quantity: 1,
          unitPrice: product.price_paid || product.unit_price || 0,
          supplier: supplierName,
          supplier_id: supplierId
        });
        toast.success(`${product.name} added to cart`);
      }
      
      // Save updated cart to localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add product to cart');
    }
  };

  // Function to navigate to orders page
  const goToCart = () => {
    navigate('/orders');
  };

  return (
    <div className="space-y-4">
      {suppliers.map(supplier => (
        <Card 
          key={supplier.supplier_id} 
          className={`border-inventory-teal/30 bg-black/80 backdrop-blur-md transition-all duration-200 ${
            expandedSupplier === supplier.supplier_id ? 'shadow-[0_0_15px_rgba(51,195,240,0.3)]' : ''
          }`}
        >
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-white text-glow-subtle">{supplier.name}</h3>
                  {supplier.type && (
                    <Badge variant="outline" className="border-inventory-teal/40 text-gray-300">
                      {supplier.type}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center mt-1">
                  {renderStars(parseFloat(generateRating(supplier.supplier_id)))}
                  <span className="text-sm text-gray-300 ml-1">
                    ({generateRating(supplier.supplier_id)})
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2 mt-2 md:mt-0">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-xs border-inventory-teal/40 bg-black/60 text-gray-300 hover:bg-inventory-teal/20"
                  onClick={() => viewSupplierDetails(supplier.supplier_id)}
                >
                  {expandedSupplier === supplier.supplier_id ? "Hide Details" : "View Details"}
                </Button>
                <Button 
                  size="sm" 
                  className="text-xs bg-inventory-teal hover:bg-inventory-teal/90 text-white shadow-[0_0_10px_rgba(51,195,240,0.2)]"
                  onClick={goToCart}
                >
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  View Cart
                </Button>
              </div>
            </div>
            
            {expandedSupplier === supplier.supplier_id && (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-black/40 rounded-md border border-inventory-teal/20">
                  <div>
                    <h4 className="text-sm font-medium text-inventory-teal mb-2">Contact Information</h4>
                    <div className="space-y-1 text-sm text-gray-300">
                      {supplier.email && <p>Email: {supplier.email}</p>}
                      {supplier.phone && <p>Phone: {supplier.phone}</p>}
                      {supplier.address && <p>Address: {supplier.address}</p>}
                      {supplier.website && (
                        <p className="flex items-center">
                          Website: 
                          <a 
                            href={supplier.website.startsWith('http') ? supplier.website : `https://${supplier.website}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-inventory-teal hover:underline ml-1 flex items-center"
                          >
                            {supplier.website} <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-inventory-teal mb-2">Supplier Details</h4>
                    <div className="space-y-1 text-sm text-gray-300">
                      <p>Products: {supplier.products.length + supplier.otherProducts.length}</p>
                      <p>Recent orders: {supplier.products.filter(p => p.last_purchase_date).length}</p>
                      <p>Products with discount: {supplier.products.filter(p => p.discount && p.discount > 0).length}</p>
                    </div>
                  </div>
                </div>
                
                <Tabs defaultValue="company-products" className="w-full">
                  <TabsList className="bg-black/60 border border-inventory-teal/30">
                    <TabsTrigger 
                      value="company-products" 
                      className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-inventory-teal"
                    >
                      Products You've Purchased
                    </TabsTrigger>
                    <TabsTrigger 
                      value="other-products" 
                      className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-inventory-teal"
                    >
                      Other Products
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="company-products" className="mt-2">
                    <SupplierProductList 
                      products={supplier.products} 
                      showDiscount={true}
                      supplierName={supplier.name}
                      supplierId={supplier.supplier_id}
                      onAddToCart={addToCart} 
                    />
                  </TabsContent>
                  
                  <TabsContent value="other-products" className="mt-2">
                    <SupplierProductList 
                      products={supplier.otherProducts}
                      showDiscount={false} 
                      supplierName={supplier.name}
                      supplierId={supplier.supplier_id}
                      onAddToCart={addToCart}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      
      {suppliers.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No suppliers found. Try adjusting your search criteria.
        </div>
      )}
    </div>
  );
};

export default SupplierMarketplace;
