
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SupplierMarketplace from "@/components/suppliers/SupplierMarketplace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter } from "lucide-react";

const Suppliers = () => {
  const [loading, setLoading] = useState(true);
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");  // Changed from empty string to "all"
  const [sortBy, setSortBy] = useState("name");
  const [companyId, setCompanyId] = useState<number | null>(null);

  // Fetch company ID from localStorage
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setCompanyId(userData.company_id);
    }
  }, []);

  // Load suppliers data
  useEffect(() => {
    const loadSuppliers = async () => {
      if (!companyId) return;
      
      try {
        setLoading(true);
        
        // Fetch suppliers that have sold products to this company
        const { data: supplierData, error } = await supabase
          .from('company_product_supplier_info')
          .select(`
            supplier_id,
            suppliers:supplier_id (
              supplier_id,
              name,
              type,
              email,
              phone,
              website,
              address
            ),
            product_id,
            products:product_id (
              product_id,
              name,
              description,
              sku,
              unit_of_measure
            ),
            price_paid,
            discount,
            last_purchase_date
          `)
          .eq('company_id', companyId)
          .order('last_purchase_date', { ascending: false });
          
        if (error) {
          console.error('Error fetching supplier data:', error);
          toast.error("Failed to load supplier data");
          return;
        }

        // Process data to group by supplier
        const supplierMap = new Map();
        
        supplierData.forEach(item => {
          if (!item.suppliers || !item.products) return;
          
          const supplierId = item.supplier_id;
          
          if (!supplierMap.has(supplierId)) {
            supplierMap.set(supplierId, {
              ...item.suppliers,
              products: [],
              otherProducts: []
            });
          }
          
          const supplier = supplierMap.get(supplierId);
          
          supplier.products.push({
            id: item.product_id,
            name: item.products.name,
            description: item.products.description,
            sku: item.products.sku,
            unit_of_measure: item.products.unit_of_measure,
            price_paid: item.price_paid,
            discount: item.discount,
            last_purchase_date: item.last_purchase_date
          });
        });
        
        // Fetch other products from these suppliers (sold to other companies)
        const supplierIds = Array.from(supplierMap.keys());
        
        if (supplierIds.length > 0) {
          const { data: otherProductsData, error: otherError } = await supabase
            .from('company_product_supplier_info')
            .select(`
              supplier_id,
              product_id,
              products:product_id (
                product_id,
                name,
                description,
                sku,
                unit_of_measure
              ),
              unit_price
            `)
            .in('supplier_id', supplierIds)
            .neq('company_id', companyId);
            
          if (!otherError && otherProductsData) {
            otherProductsData.forEach(item => {
              if (!item.products) return;
              
              const supplierId = item.supplier_id;
              if (!supplierMap.has(supplierId)) return;
              
              const supplier = supplierMap.get(supplierId);
              
              // Check if this product is already in the supplier's products
              const isDuplicate = supplier.products.some(p => p.id === item.product_id);
              const isInOtherProducts = supplier.otherProducts.some(p => p.id === item.product_id);
              
              if (!isDuplicate && !isInOtherProducts) {
                supplier.otherProducts.push({
                  id: item.product_id,
                  name: item.products.name,
                  description: item.products.description,
                  sku: item.products.sku,
                  unit_of_measure: item.products.unit_of_measure,
                  unit_price: item.unit_price
                });
              }
            });
          }
        }
        
        // Convert map to array for state
        setSuppliers(Array.from(supplierMap.values()));
      } catch (error) {
        console.error('Error in supplier data loading:', error);
        toast.error("Failed to load supplier data");
      } finally {
        setLoading(false);
      }
    };
    
    loadSuppliers();
  }, [companyId]);

  // Filter suppliers based on search term and category
  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = 
      searchTerm === "" || 
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.products.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      supplier.otherProducts.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesCategory = 
      categoryFilter === "all" || // Changed from empty string to "all"
      supplier.type === categoryFilter;
      
    return matchesSearch && matchesCategory;
  });

  // Sort suppliers
  const sortedSuppliers = [...filteredSuppliers].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "recent") {
      const aDate = a.products[0]?.last_purchase_date || "";
      const bDate = b.products[0]?.last_purchase_date || "";
      return bDate.localeCompare(aDate); // Most recent first
    }
    return 0;
  });

  // Get unique supplier categories
  const supplierCategories = [...new Set(suppliers.map(s => s.type).filter(Boolean))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white text-glow-strong">Supplier Marketplace</h1>
          <p className="text-sm text-gray-300 mt-1">
            Browse suppliers and their products, compare prices, and place orders
          </p>
        </div>
      </div>

      <Card className="border-inventory-teal/30 bg-black/70 backdrop-blur-md">
        <CardHeader className="border-b border-inventory-teal/20">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search suppliers or products..."
                className="pl-8 bg-black/60 border-inventory-teal/40 text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <div className="w-40">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="bg-black/60 border-inventory-teal/40 text-gray-300">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem> {/* Changed from empty string to "all" */}
                    {supplierCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-40">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-black/60 border-inventory-teal/40 text-gray-300">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="recent">Recently Ordered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-pulse text-inventory-teal">Loading supplier data...</div>
            </div>
          ) : sortedSuppliers.length > 0 ? (
            <div className="space-y-6">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="bg-black/60 border border-inventory-teal/30 mb-4">
                  <TabsTrigger 
                    value="all" 
                    className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-inventory-teal"
                  >
                    All Suppliers
                  </TabsTrigger>
                  <TabsTrigger 
                    value="recent" 
                    className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-inventory-teal"
                  >
                    Recent Orders
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  <SupplierMarketplace suppliers={sortedSuppliers} />
                </TabsContent>
                
                <TabsContent value="recent">
                  <SupplierMarketplace 
                    suppliers={sortedSuppliers.filter(s => 
                      s.products.some(p => p.last_purchase_date)
                    ).sort((a, b) => {
                      const aDate = a.products[0]?.last_purchase_date || "";
                      const bDate = b.products[0]?.last_purchase_date || "";
                      return bDate.localeCompare(aDate);
                    }).slice(0, 5)} 
                  />
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              No suppliers found matching your search criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Suppliers;
