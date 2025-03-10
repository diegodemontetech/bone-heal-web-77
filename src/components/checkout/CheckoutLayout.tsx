
import React from "react";
import { ShoppingBag } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";

interface CheckoutLayoutProps {
  children: React.ReactNode;
}

const CheckoutLayout: React.FC<CheckoutLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <ShoppingBag className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Checkout</h1>
        </div>
        <Separator className="mb-8" />
        
        {children}
      </div>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default CheckoutLayout;
