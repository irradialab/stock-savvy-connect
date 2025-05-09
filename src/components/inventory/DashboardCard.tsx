
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const DashboardCard = ({ title, children, className = "" }: DashboardCardProps) => {
  return (
    <Card className={`shadow-md border-inventory-teal/30 ${className}`}>
      <CardHeader className="pb-2 border-b border-inventory-teal/20">
        <CardTitle className="text-lg font-medium text-white text-glow-subtle">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default DashboardCard;
