import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import OrderConfirm from "./pages/OrderConfirm";
import OrderTracking from "./pages/OrderTracking";
import CoffeeWallet from "./pages/CoffeeWallet";
import AddressManagement from "./pages/AddressManagement";
import ShareEarn from "./pages/ShareEarn";
import MySquad from "./pages/MySquad";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="max-w-md mx-auto min-h-screen bg-background relative">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/order-confirm" element={<OrderConfirm />} />
            <Route path="/order-tracking" element={<OrderTracking />} />
            <Route path="/wallet" element={<CoffeeWallet />} />
            <Route path="/address" element={<AddressManagement />} />
            <Route path="/share-earn" element={<ShareEarn />} />
            <Route path="/my-squad" element={<MySquad />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
