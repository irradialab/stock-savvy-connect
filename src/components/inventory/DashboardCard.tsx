
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const DashboardCard = ({ title, children, className = "" }: DashboardCardProps) => {
  return (
    <Card className={`shadow-lg border-inventory-teal/30 ${className}`}>
      <CardHeader className="pb-2 border-b border-inventory-teal/30 bg-black/60">
        <CardTitle className="text-lg font-medium text-white text-glow-subtle">{title}</CardTitle>
      </CardHeader>
      <CardContent className="bg-black/60">{children}</CardContent>
    </Card>
  );
};

export default DashboardCard;
