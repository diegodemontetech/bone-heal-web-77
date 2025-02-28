
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: React.ReactNode;
  adminEmail?: string | null;
}

const Layout = ({ children, adminEmail: propAdminEmail }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [adminEmail, setAdminEmail] = useState<string | null>(propAdminEmail || null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("No session in Layout component, redirecting to login");
          navigate("/admin/login");
          return;
        }
        
        // TEMPORARY WORKAROUND:
        // Check if the user email is in the hardcoded admin list
        const adminEmails = ['boneheal.ti@gmail.com']; // Add any other admin emails here
        const isAdmin = adminEmails.includes(session.user.email || '');

        console.log("Layout admin check - Email:", session.user.email, "Is admin:", isAdmin);
        
        if (!isAdmin) {
          console.log("User not admin in Layout component, redirecting to login. Email:", session.user.email);
          toast({
            title: "Acesso negado",
            description: "Você não tem permissão para acessar a área administrativa.",
            variant: "destructive",
          });
          navigate("/admin/login");
          return;
        }
        
        setAdminEmail(session.user.email);
        console.log("Admin access confirmed in Layout for:", session.user.email);
      } catch (error) {
        console.error("Error in Layout admin check:", error);
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao verificar suas permissões.",
          variant: "destructive",
        });
        navigate("/admin/login");
      }
    };
    
    if (!propAdminEmail) {
      checkSession();
    }
  }, [navigate, toast, propAdminEmail]);
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado",
        description: "Você saiu da área administrativa.",
      });
      navigate("/admin/login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao tentar sair. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  const menuItems = [
    { label: "Dashboard", path: "/admin" },
    { label: "Usuários", path: "/admin/users" },
    { label: "Produtos", path: "/admin/products" },
    { label: "Pedidos", path: "/admin/orders" },
    { label: "Sincronização", path: "/admin/sync" },
    { label: "Notícias", path: "/admin/news" },
    { label: "Artigos", path: "/admin/studies" },
    { label: "Fretes", path: "/admin/shipping-rates" },
    { label: "WhatsApp", path: "/admin/whatsapp" },
    { label: "Leads", path: "/admin/leads" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar (hidden on small screens) */}
      <aside className="hidden md:flex flex-col w-64 bg-gray-800 text-white">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          {adminEmail && (
            <p className="text-gray-400 text-sm mt-1">{adminEmail}</p>
          )}
        </div>
        <nav className="flex-1">
          <ul>
            {menuItems.map((item) => (
              <li key={item.label} className="px-4 py-2">
                <Link
                  to={item.path}
                  className={`block p-2 hover:bg-gray-700 rounded ${
                    location.pathname === item.path ? "bg-gray-700" : ""
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-white hover:bg-gray-700" 
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger className="md:hidden absolute top-4 left-4">
          <Menu />
        </SheetTrigger>
        <SheetContent className="w-64 bg-gray-800 text-white">
          <SheetHeader className="p-4">
            <SheetTitle className="text-2xl font-bold text-white">Admin Panel</SheetTitle>
            <SheetDescription className="text-gray-400">
              Navegue pelo painel administrativo.
            </SheetDescription>
            {adminEmail && (
              <p className="text-gray-400 text-sm mt-1">{adminEmail}</p>
            )}
          </SheetHeader>
          <nav className="flex-1">
            <ul>
              {menuItems.map((item) => (
                <li key={item.label} className="p-2">
                  <Link
                    to={item.path}
                    className={`block p-2 hover:bg-gray-700 rounded ${
                      location.pathname === item.path ? "bg-gray-700" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-4 border-t border-gray-700">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-white hover:bg-gray-700" 
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;
