import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { Boxes, Truck, AlertTriangle, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface InventoryStatsProps {
  companyId: number | null;
}

const InventoryStats = ({ companyId }: InventoryStatsProps) => {
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockItems: 0,
    incomingOrders: 0,
    turnoverRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) return;

    const fetchStats = async () => {
      setLoading(true);
      try {
        // Get total products
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('product_id, needs_reorder_flag')
          .eq('company_id', companyId);

        if (productsError) {
          console.error('Error fetching products:', productsError);
          return;
        }

        // Calculate low stock items
        const lowStockItems = products.filter(product => product.needs_reorder_flag).length;

        // For incoming movements, we could search in stock_movements
        const { data: movements, error: movementsError } = await supabase
          .from('stock_movements')
          .select('movement_id')
          .eq('movement_type', 'incoming')
          .eq('update_type', 'order');

        if (movementsError) {
          console.error('Error fetching movements:', movementsError);
          return;
        }

        // Calculate statistics
        setStats({
          totalItems: products.length,
          lowStockItems: lowStockItems,
          incomingOrders: movements?.length || 0,
          turnoverRate: 32 // Fictitious value for now, could be calculated with real data
        });
      } catch (error) {
        console.error('Error fetching inventory stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [companyId]);

  if (loading) {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => (
        <Card key={i} className="shadow-sm">
          <CardContent className="p-6">
            <div className="animate-pulse h-16"></div>
          </CardContent>
        </Card>
      ))}
    </div>;
  }

  const statsData = [
    {
      title: "Total Products",
      value: stats.totalItems.toString(),
      icon: Boxes,
      change: "+5.2%",
      positive: true,
    },
    {
      title: "Low Stock",
      value: stats.lowStockItems.toString(),
      icon: AlertTriangle,
      change: "-8%",
      positive: true,
    },
    {
      title: "Incoming Orders",
      value: stats.incomingOrders.toString(),
      icon: Truck,
      change: "+12%",
      positive: true,
    },
    {
      title: "Monthly Turnover",
      value: `${stats.turnoverRate}%`,
      icon: TrendingUp,
      change: "+3.1%",
      positive: true,
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat, index) => (
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
                <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={stat.positive ? "text-green-600" : "text-red-600"}>
                {stat.change} since last month
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default InventoryStats;
