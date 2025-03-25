
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
    
    // Ensure theme and colors are correctly applied
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
  }, [location.pathname]);

  // Determine if we're on a page that already has layout
  const hasNestedLayout = location.pathname.includes('/admin/crm/') && (children === undefined);

  if (hasNestedLayout) {
    // Only render content without adding another layout
    return <Outlet />;
  }

  return (
    <div className="flex min-h-screen bg-neutral-50 text-foreground">
      {/* Desktop Sidebar - Only visible on medium screens and up */}
      <div className="hidden md:flex md:w-64 md:flex-shrink-0 md:fixed h-screen z-10">
        <AdminSidebar />
      </div>
      
      {/* Mobile Navigation */}
      <AdminMobileNav />
      
      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        <main className="p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default Layout;
