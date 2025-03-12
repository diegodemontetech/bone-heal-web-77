
import { ReactNode, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AdminSidebar } from "./navigation/AdminSidebar";
import { AdminMobileNav } from "./navigation/AdminMobileNav";

interface LayoutProps {
  children?: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  
  useEffect(() => {
    console.log("Admin Layout renderizado. Rota atual:", location.pathname);
    
    // Garantir que o tema e cores estejam aplicados corretamente
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop Sidebar - Visível apenas em telas médias e maiores */}
      <div className="hidden md:flex md:w-64 md:flex-shrink-0 md:fixed h-screen z-10">
        <AdminSidebar />
      </div>
      
      {/* Mobile Navigation */}
      <AdminMobileNav />
      
      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        <main className="p-4">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default Layout;
