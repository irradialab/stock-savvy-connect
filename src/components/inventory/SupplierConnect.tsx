
import { Button } from "@/components/ui/button";
import { Star, StarIcon, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Supplier {
  id: number;
  name: string;
  itemCategories: string[];
  rating: number;
  isFavorite: boolean;
}

const SupplierConnect = () => {
  const navigate = useNavigate();
  const suppliers: Supplier[] = [
    {
      id: 1,
      name: "Tech Components Inc.",
      itemCategories: ["CPUs", "GPUs", "Motherboards"],
      rating: 4.8,
      isFavorite: true,
    },
    {
      id: 2,
      name: "Storage Solutions Ltd.",
      itemCategories: ["SSDs", "HDDs", "Memory Cards"],
      rating: 4.5,
      isFavorite: false,
    },
    {
      id: 3,
      name: "Power & Cooling Co.",
      itemCategories: ["Power Supplies", "Fans", "Cooling Systems"],
      rating: 4.2,
      isFavorite: true,
    },
    {
      id: 4,
      name: "Display Experts",
      itemCategories: ["Monitors", "Cables", "Adapters"],
      rating: 4.0,
      isFavorite: false,
    },
  ];

  const goToSuppliers = () => {
    navigate('/suppliers');
  };

  return (
    <div className="space-y-3">
      {suppliers.map((supplier) => (
        <SupplierCard key={supplier.id} supplier={supplier} />
      ))}
      <div className="text-center mt-4">
        <Button 
          className="bg-inventory-teal hover:bg-inventory-teal/90 text-white shadow-[0_0_10px_rgba(51,195,240,0.2)]"
          onClick={goToSuppliers}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Visit Supplier Marketplace
        </Button>
      </div>
    </div>
  );
};

const SupplierCard = ({ supplier }: { supplier: Supplier }) => {
  return (
    <div className="p-3 bg-inventory-blue/50 border border-inventory-teal/30 rounded-md shadow-md backdrop-blur-sm">
      <div className="flex justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-white text-glow-subtle">{supplier.name}</h3>
            {supplier.isFavorite && (
              <StarIcon className="h-4 w-4 text-yellow-300 fill-yellow-300" />
            )}
          </div>
          <div className="text-xs text-gray-300 mt-1">
            {supplier.itemCategories.join(" • ")}
          </div>
        </div>
        <div className="flex items-center text-sm text-white">
          <Star className="h-4 w-4 text-yellow-300 mr-1" />
          <span>{supplier.rating}</span>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <Button 
          size="sm" 
          variant="outline" 
          className="text-xs h-8 border-inventory-teal/40 text-gray-200 hover:bg-inventory-teal/20 hover:text-white"
        >
          View Catalog
        </Button>
        <Button 
          size="sm" 
          className="text-xs h-8 bg-inventory-teal hover:bg-inventory-teal/90 text-white shadow-[0_0_10px_rgba(51,195,240,0.2)]"
        >
          Contact
        </Button>
      </div>
    </div>
  );
};

export default SupplierConnect;
