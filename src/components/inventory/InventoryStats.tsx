
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpCircleIcon, ArrowDownCircleIcon } from "@radix-ui/react-icons";
import { Boxes, Truck, AlertTriangle, TrendingUp } from "lucide-react";

const InventoryStats = () => {
  const stats = [
    {
      title: "Total Items",
      value: "1,248",
      icon: Boxes,
      change: "+5.2%",
      positive: true,
    },
    {
      title: "Low Stock Items",
      value: "12",
      icon: AlertTriangle,
      change: "-8%",
      positive: true,
    },
    {
      title: "Incoming Orders",
      value: "24",
      icon: Truck,
      change: "+12%",
      positive: true,
    },
    {
      title: "Monthly Turnover",
      value: "32%",
      icon: TrendingUp,
      change: "+3.1%",
      positive: true,
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className="bg-inventory-light-blue p-3 rounded-lg">
                <stat.icon className="h-5 w-5 text-inventory-teal" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-xs">
              {stat.positive ? (
                <ArrowUpCircleIcon className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownCircleIcon className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={stat.positive ? "text-green-600" : "text-red-600"}>
                {stat.change} from last month
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default InventoryStats;
