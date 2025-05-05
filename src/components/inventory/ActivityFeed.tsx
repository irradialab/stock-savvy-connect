
import { CheckCircle, XCircle, PlusCircle, MinusCircle, Truck } from "lucide-react";

interface ActivityItem {
  id: number;
  type: "incoming" | "outgoing" | "adjustment" | "order";
  itemName: string;
  quantity: number;
  date: string;
  user: string;
}

const ActivityFeed = () => {
  const activities: ActivityItem[] = [
    { 
      id: 1, 
      type: "incoming", 
      itemName: "CPU Processors", 
      quantity: 25, 
      date: "2023-06-04T10:15:00", 
      user: "John Supplier" 
    },
    { 
      id: 2, 
      type: "outgoing", 
      itemName: "Graphics Cards", 
      quantity: 5, 
      date: "2023-06-04T11:30:00", 
      user: "Sales Dept" 
    },
    { 
      id: 3, 
      type: "adjustment", 
      itemName: "RAM Modules", 
      quantity: -3, 
      date: "2023-06-03T14:45:00",
      user: "Inventory Manager" 
    },
    { 
      id: 4, 
      type: "order", 
      itemName: "SSDs", 
      quantity: 50, 
      date: "2023-06-03T16:00:00",
      user: "Procurement" 
    },
    { 
      id: 5, 
      type: "incoming", 
      itemName: "Power Supplies", 
      quantity: 20, 
      date: "2023-06-02T09:15:00",
      user: "Hardware Supplier Co." 
    },
  ];

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
    </div>
  );
};

const ActivityItem = ({ activity }: { activity: ActivityItem }) => {
  const getIcon = () => {
    switch (activity.type) {
      case "incoming":
        return <PlusCircle className="h-5 w-5 text-green-500" />;
      case "outgoing":
        return <MinusCircle className="h-5 w-5 text-red-500" />;
      case "adjustment":
        return activity.quantity > 0 
          ? <CheckCircle className="h-5 w-5 text-blue-500" />
          : <XCircle className="h-5 w-5 text-orange-500" />;
      case "order":
        return <Truck className="h-5 w-5 text-purple-500" />;
      default:
        return null;
    }
  };

  const getTypeText = () => {
    switch (activity.type) {
      case "incoming":
        return "Stock received";
      case "outgoing":
        return "Stock shipped";
      case "adjustment":
        return "Inventory adjusted";
      case "order":
        return "Order placed";
      default:
        return "";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="flex items-start space-x-3 p-3 bg-white rounded-md shadow-sm">
      <div className="flex-shrink-0 mt-1">{getIcon()}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{getTypeText()}: {activity.itemName}</p>
        <p className="text-xs text-gray-500">
          {activity.quantity > 0 ? '+' : ''}{activity.quantity} units • {activity.user}
        </p>
      </div>
      <div className="text-xs text-gray-500">{formatDate(activity.date)}</div>
    </div>
  );
};

export default ActivityFeed;
