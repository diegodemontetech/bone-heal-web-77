
import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./navigation/AdminSidebar";
import { AdminMobileNav } from "./navigation/AdminMobileNav";

interface LayoutProps {
  children?: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar - Visível apenas em telas médias e maiores */}
      <div className="hidden md:block w-64 flex-shrink-0">
        <div className="fixed h-screen border-r">
          <AdminSidebar />
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <AdminMobileNav />
      
      {/* Main Content */}
      <main className="flex-1 bg-gray-50 md:ml-64">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default Layout;
