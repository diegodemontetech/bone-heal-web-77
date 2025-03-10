
import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./navigation/AdminSidebar";
import { AdminMobileNav } from "./navigation/AdminMobileNav";

interface LayoutProps {
  children?: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar - Visível apenas em telas médias e maiores */}
      <div className="hidden md:flex md:w-64 md:flex-shrink-0 md:fixed h-screen z-10">
        <AdminSidebar />
      </div>
      
      {/* Mobile Navigation */}
      <AdminMobileNav />
      
      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        <main className="p-0">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default Layout;
