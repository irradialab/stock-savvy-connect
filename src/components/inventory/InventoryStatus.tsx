
import { Progress } from "@/components/ui/progress";

interface InventoryItemProps {
  name: string;
  currentStock: number;
  capacity: number;
  category: string;
}

const InventoryStatus = () => {
  const inventoryItems: InventoryItemProps[] = [
    { name: "CPU Processors", currentStock: 145, capacity: 200, category: "Electronics" },
    { name: "Graphics Cards", currentStock: 58, capacity: 150, category: "Electronics" },
    { name: "RAM Modules", currentStock: 312, capacity: 500, category: "Electronics" },
    { name: "SSDs", currentStock: 87, capacity: 350, category: "Storage" },
    { name: "Power Supplies", currentStock: 134, capacity: 200, category: "Power" },
  ];

  return (
    <div className="space-y-4">
      {inventoryItems.map((item) => (
        <InventoryItem key={item.name} {...item} />
      ))}
    </div>
  );
};

const InventoryItem = ({ name, currentStock, capacity, category }: InventoryItemProps) => {
  const percentage = Math.round((currentStock / capacity) * 100);
  
  let progressColor = "bg-inventory-success";
  if (percentage < 25) {
    progressColor = "bg-inventory-danger";
  } else if (percentage < 50) {
    progressColor = "bg-inventory-warning";
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-medium text-sm">{name}</h4>
          <p className="text-xs text-gray-500">{category}</p>
        </div>
        <div className="text-sm">
          {currentStock} / {capacity}
        </div>
      </div>
      <Progress value={percentage} className={`h-2 ${progressColor}`} />
    </div>
  );
};

export default InventoryStatus;
