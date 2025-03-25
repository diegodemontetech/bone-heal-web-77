
import { Link, useLocation } from "react-router-dom";
import { LogOut, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth-context";
import { adminNavigationItems } from "./AdminNavigationItems";
import { useState, useEffect } from "react";

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

export const AdminSidebar = ({ onCloseMobile }: AdminSidebarProps) => {
  const { pathname } = useLocation();
  const { signOut } = useAuth();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  
  // Expand automatically the item that corresponds to the current route
  useEffect(() => {
    const newExpandedItems: Record<string, boolean> = {};
    
    adminNavigationItems.forEach(item => {
      if (item.children) {
        const shouldExpand = pathname.includes(item.href) || 
          item.children.some(child => pathname.includes(child.href));
        newExpandedItems[item.title] = shouldExpand;
      }
    });
    
    setExpandedItems(prev => ({
      ...prev,
      ...newExpandedItems
    }));
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  const toggleExpand = (title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setExpandedItems(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r shadow-sm">
      <div className="px-4 py-3 flex items-center justify-between border-b">
        <Link to="/admin/dashboard" className="font-semibold text-lg text-primary">
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
      <ScrollArea className="flex-1 py-3">
        <nav className="grid gap-1 px-2">
          {adminNavigationItems.map((item) => (
            <div key={item.title} className="flex flex-col">
              <div
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                  pathname === item.href 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "hover:bg-neutral-100"
                )}
              >
                <Link
                  to={item.href}
                  onClick={onCloseMobile}
                  className="flex items-center gap-3 flex-1"
                >
                  <item.icon className={cn(
                    "h-4 w-4",
                    pathname === item.href ? "text-primary" : "text-neutral-500"
                  )} />
                  {item.title}
                </Link>
                {item.children && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 p-0" 
                    onClick={(e) => toggleExpand(item.title, e)}
                  >
                    {expandedItems[item.title] ? 
                      <ChevronUp className="h-4 w-4" /> : 
                      <ChevronDown className="h-4 w-4" />
                    }
                  </Button>
                )}
              </div>
              
              {item.children && expandedItems[item.title] && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      to={child.href}
                      onClick={onCloseMobile}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        pathname === child.href
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-neutral-100"
                      )}
                    >
                      {child.icon && <child.icon className={cn(
                        "h-4 w-4",
                        pathname === child.href ? "text-primary" : "text-neutral-500"
                      )} />}
                      {child.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>
      <div className="mt-auto p-2 border-t">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-start text-neutral-700 hover:text-neutral-900"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  );
};
