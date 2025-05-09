
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import InventoryDashboard from "./pages/inventory/InventoryDashboard";
import Orders from "./pages/orders/Orders";
import Suppliers from "./pages/suppliers/Suppliers";
import Layout from "./components/Layout";
import AuthGuard from "./components/auth/AuthGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/inventory" element={
            <AuthGuard>
              <Layout>
                <InventoryDashboard />
              </Layout>
            </AuthGuard>
          } />
          <Route path="/orders" element={
            <AuthGuard>
              <Layout>
                <Orders />
              </Layout>
            </AuthGuard>
          } />
          <Route path="/suppliers" element={
            <AuthGuard>
              <Layout>
                <Suppliers />
              </Layout>
            </AuthGuard>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
