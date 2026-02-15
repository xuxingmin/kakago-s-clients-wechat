import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AddressProvider } from "@/contexts/AddressContext";
import Index from "./pages/Index";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import OrderConfirm from "./pages/OrderConfirm";
import OrderTracking from "./pages/OrderTracking";
import CoffeeWallet from "./pages/CoffeeWallet";
import KakaBeans from "./pages/KakaBeans";
import AddressManagement from "./pages/AddressManagement";
import AddressFormPage from "./pages/AddressFormPage";
import AddressSelectPage from "./pages/AddressSelectPage";
import InvoiceManagement from "./pages/InvoiceManagement";
import MySquad from "./pages/MySquad";
import MerchantAuth from "./pages/MerchantAuth";
import MerchantDashboard from "./pages/MerchantDashboard";
import Coupons from "./pages/Coupons";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// App with Language support
const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <AddressProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <div className="w-[393px] mx-auto min-h-screen bg-background relative overflow-hidden">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/order-confirm" element={<OrderConfirm />} />
                    <Route path="/order-tracking" element={<OrderTracking />} />
                    <Route path="/wallet" element={<CoffeeWallet />} />
                    <Route path="/kaka-beans" element={<KakaBeans />} />
                    <Route path="/coupons" element={<Coupons />} />
                    <Route path="/address" element={<AddressManagement />} />
                    <Route path="/address/new" element={<AddressFormPage />} />
                    <Route path="/address/edit/:id" element={<AddressFormPage />} />
                    <Route path="/address/select" element={<AddressSelectPage />} />
                    <Route path="/invoice" element={<InvoiceManagement />} />
                    <Route path="/my-squad" element={<MySquad />} />
                    <Route path="/merchant-auth" element={<MerchantAuth />} />
                    <Route path="/merchant" element={<MerchantDashboard />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </BrowserRouter>
            </TooltipProvider>
          </CartProvider>
        </AddressProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
