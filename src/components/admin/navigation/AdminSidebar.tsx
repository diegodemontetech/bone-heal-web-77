
import { Link, useLocation } from "react-router-dom";
import { LogOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth-context";
import { adminNavigationItems } from "./AdminNavigationItems";

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

export const AdminSidebar = ({ onCloseMobile }: AdminSidebarProps) => {
  const { pathname } = useLocation();
  const { signOut, isAdminMaster, hasPermission } = useAuth();
  
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  // Filtra os itens de navegação baseados nas permissões do usuário
  const filteredNavigationItems = adminNavigationItems.filter(item => {
    return item.permission === null || isAdminMaster || (item.permission && hasPermission(item.permission));
  });

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="px-3.5 py-2 flex items-center justify-between border-b">
        <Link to="/admin/dashboard" className="font-semibold text-lg">
          Bone Heal Admin
        </Link>
        {onCloseMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={onCloseMobile}
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1 py-2">
        <nav className="grid gap-1 px-2">
          {filteredNavigationItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={onCloseMobile}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="mt-auto p-2 border-t">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-start"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  );
};
