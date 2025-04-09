
import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";

interface RouteWithSidebarProps {
  children: React.ReactNode;
}

const RouteWithSidebar = ({ children }: RouteWithSidebarProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        {children}
      </div>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default RouteWithSidebar;
