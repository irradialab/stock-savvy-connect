
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Phone, Mail, Globe, Search, MessageCircle, X, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

interface Supplier {
  supplier_id: number;
  name: string;
  email: string | null;
  phone: string | null;
  website: string | null;
  type: string | null;
}

interface SupplierConnectProps {
  companyId?: number | null;
}

const WhatsAppSupport = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const whatsappNumber = "+573150654118";

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isMinimized ? (
        <Button
          onClick={() => setIsMinimized(false)}
          className="bg-[#25D366] hover:bg-[#25D366]/90 text-white rounded-full p-4 shadow-lg flex items-center gap-2"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="font-medium">¿Necesitas ayuda?</span>
        </Button>
      ) : (
        <Card className="w-80 bg-black/90 border-inventory-teal/30 shadow-lg">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="bg-[#25D366] rounded-full p-2">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-white font-semibold">Soporte WhatsApp</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                className="text-gray-400 hover:text-white"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3">
              <p className="text-gray-300 text-sm">
                ¿Necesitas ayuda para encontrar proveedores? ¡Estoy aquí para ayudarte!
              </p>
              <Button
                className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white"
                onClick={() => window.open(`https://wa.me/${whatsappNumber.replace('+', '')}`, '_blank')}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Chatear por WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const SupplierConnect = ({ companyId }: SupplierConnectProps) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('suppliers')
          .select('*')
          .order('name');

        if (error) {
          console.error('Error fetching suppliers:', error);
          return;
        }

        setSuppliers(data || []);
        setFilteredSuppliers(data || []);
      } catch (error) {
        console.error('Error in supplier fetch:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  useEffect(() => {
    const filtered = suppliers.filter(supplier =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSuppliers(filtered);
  }, [searchTerm, suppliers]);

  const goToSuppliers = () => {
    navigate('/suppliers');
  };

  if (loading) {
    return <div className="text-center py-4 text-gray-400">Loading suppliers...</div>;
  }

  return (
    <>
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-black/60 border-inventory-teal/30 text-white placeholder:text-gray-400"
          />
        </div>
        {filteredSuppliers.length === 0 ? (
          <div className="text-center py-4 text-gray-400">No suppliers found</div>
        ) : (
          <>
            <div className="grid gap-4">
              {filteredSuppliers.map((supplier) => (
                <Card key={supplier.supplier_id} className="bg-black/60 border-inventory-teal/30">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{supplier.name}</h3>
                        <div className="mt-2 space-y-1">
                          {supplier.phone && (
                            <div className="flex items-center text-sm text-gray-300">
                              <Phone className="h-4 w-4 mr-2" />
                              <span>{supplier.phone}</span>
                            </div>
                          )}
                          {supplier.email && (
                            <div className="flex items-center text-sm text-gray-300">
                              <Mail className="h-4 w-4 mr-2" />
                              <span>{supplier.email}</span>
                            </div>
                          )}
                          {supplier.website && (
                            <div className="flex items-center text-sm text-gray-300">
                              <Globe className="h-4 w-4 mr-2" />
                              <a 
                                href={supplier.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-inventory-teal hover:underline"
                              >
                                {supplier.website}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-inventory-teal hover:bg-inventory-teal/90 text-white shadow-[0_0_10px_rgba(51,195,240,0.2)]"
                      >
                        Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-4">
              <Button 
                className="bg-inventory-teal hover:bg-inventory-teal/90 text-white shadow-[0_0_10px_rgba(51,195,240,0.2)]"
                onClick={goToSuppliers}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Visit Supplier Marketplace
              </Button>
            </div>
          </>
        )}
      </div>
      <WhatsAppSupport />
    </>
  );
};

export default SupplierConnect;
