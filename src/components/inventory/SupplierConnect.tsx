
import { Button } from "@/components/ui/button";
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";

interface Supplier {
  id: number;
  name: string;
  itemCategories: string[];
  rating: number;
  isFavorite: boolean;
}

const SupplierConnect = () => {
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

  return (
    <div className="space-y-3">
      {suppliers.map((supplier) => (
        <SupplierCard key={supplier.id} supplier={supplier} />
      ))}
    </div>
  );
};

const SupplierCard = ({ supplier }: { supplier: Supplier }) => {
  return (
    <div className="p-3 bg-white rounded-md shadow-sm">
      <div className="flex justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{supplier.name}</h3>
            {supplier.isFavorite && (
              <StarFilledIcon className="h-4 w-4 text-yellow-400" />
            )}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {supplier.itemCategories.join(" • ")}
          </div>
        </div>
        <div className="flex items-center text-sm">
          <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
          <span>{supplier.rating}</span>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <Button size="sm" variant="outline" className="text-xs h-8">View Catalog</Button>
        <Button size="sm" className="text-xs h-8 bg-inventory-teal hover:bg-inventory-teal/90">Contact</Button>
      </div>
    </div>
  );
};

export default SupplierConnect;
