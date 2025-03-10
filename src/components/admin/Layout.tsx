
import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./navigation/AdminSidebar";
import { AdminMobileNav } from "./navigation/AdminMobileNav";

interface LayoutProps {
  children?: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen w-full">
      {/* Desktop Sidebar - Visible apenas em telas médias e maiores */}
      <div className="hidden md:block">
        <div className="h-screen w-64 border-r">
          <AdminSidebar />
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <AdminMobileNav />
      
      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default Layout;
