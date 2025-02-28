
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

const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/admin/login");
        return;
      }
      
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin, email")
        .eq("id", session.user.id)
        .single();
        
      if (!profile?.is_admin) {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para acessar a área administrativa.",
          variant: "destructive",
        });
        navigate("/admin/login");
        return;
      }
      
      setAdminEmail(profile.email || session.user.email);
    };
    
    checkSession();
  }, [navigate, toast]);
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logout realizado",
      description: "Você saiu da área administrativa.",
    });
    navigate("/admin/login");
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
