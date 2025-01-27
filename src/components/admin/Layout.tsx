import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Newspaper,
  FileText,
  Users,
  Truck,
  UserSquare2,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const session = useSession();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Newspaper, label: "Produtos", href: "/admin/products" },
    { icon: FileText, label: "Estudos", href: "/admin/studies" },
    { icon: Newspaper, label: "Notícias", href: "/admin/news" },
    { icon: Users, label: "Usuários", href: "/admin/users" },
    { icon: Truck, label: "Fretes", href: "/admin/shipping-rates" },
    { icon: UserSquare2, label: "Leads", href: "/admin/leads" },
    { icon: MessageCircle, label: "WhatsApp", href: "/admin/whatsapp-messages" },
  ];

  const handleSignOut = async () => {
    try {
      console.log("Starting sign out process");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error);
        toast.error("Erro ao sair: " + error.message);
      } else {
        console.log("Sign out successful");
        toast.success("Sessão encerrada");
        navigate("/admin/login");
      }
    } catch (error: any) {
      console.error("Unexpected error during sign out:", error);
      toast.error("Erro inesperado ao sair");
    }
  };

  useEffect(() => {
    if (!session) {
      navigate("/admin/login");
    }
  }, [session, navigate]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
        <nav className="mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${
                  location.pathname === item.href ? "bg-gray-100" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.href);
                }}
              >
                <Icon className="w-5 h-5 mr-2" />
                {item.label}
              </a>
            );
          })}
          <div className="px-4 py-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleSignOut}
            >
              Sair
            </Button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;