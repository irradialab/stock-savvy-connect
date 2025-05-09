import { Link } from 'react-router-dom';
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { BarChart3, Boxes, ShoppingCart, Truck, Users } from 'lucide-react';

const Sidebar = () => {
  return (
    <SidebarComponent>
      <div className="flex items-center h-14 px-4 border-b border-inventory-teal/30 bg-black/80">
        <SidebarTrigger />
        <div className="ml-2 font-semibold text-lg text-white text-glow">
          Stock Savvy Connect
        </div>
      </div>
      <SidebarContent className="bg-black/80 border-r border-inventory-teal/30">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400">Main Menu</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/inventory" className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-inventory-teal/20 transition-colors">
                  <Boxes size={20} />
                  <span>Inventory</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/orders" className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-inventory-teal/20 transition-colors">
                  <ShoppingCart size={20} />
                  <span>Orders</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/suppliers" className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-inventory-teal/20 transition-colors">
                  <Truck size={20} />
                  <span>Suppliers</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </SidebarComponent>
  );
};

export default Sidebar;
