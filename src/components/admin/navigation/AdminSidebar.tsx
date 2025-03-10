
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LogOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth-context";
import { adminNavigationItems, NavigationItem } from "./AdminNavigationItems";

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
          {adminNavigationItems.map((item: NavigationItem) => {
            // Mostrar todos os itens para admin master ou verificar permissões específicas
            const hasAccess = item.permission === null || 
                             isAdminMaster || 
                             (item.permission && hasPermission(item.permission));
            
            // Para debug temporário, vamos mostrar todos os itens
            // Remova esta linha depois que o problema estiver resolvido
            console.log(`Menu item: ${item.title}, Permission: ${item.permission}, Has access: ${hasAccess}`);
            
            // Retornar null esconde o item do menu
            if (!hasAccess) return null;
            
            return (
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
            );
          })}
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
