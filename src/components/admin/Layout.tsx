
import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { 
  Users, Package, ShoppingCart, 
  Settings, FileText, Bell, BarChart3,
  Tag, BookOpen, MessageSquare, RefreshCw,
  LogOut, Menu, X, Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth-context";
import { UserPermission } from "@/types/auth";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const { signOut, isAdminMaster, hasPermission } = useAuth();
  
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  const navigation = [
    {
      title: 'Painel',
      href: '/admin/dashboard',
      icon: BarChart3,
      permission: null
    },
    {
      title: 'Usuários',
      href: '/admin/users',
      icon: Users,
      permission: UserPermission.MANAGE_USERS
    },
    {
      title: 'Produtos',
      href: '/admin/products',
      icon: Package,
      permission: UserPermission.MANAGE_PRODUCTS
    },
    {
      title: 'Pedidos',
      href: '/admin/orders',
      icon: ShoppingCart,
      permission: UserPermission.MANAGE_ORDERS
    },
    {
      title: 'Vouchers',
      href: '/admin/vouchers',
      icon: Tag,
      permission: UserPermission.MANAGE_PRODUCTS
    },
    {
      title: 'Notícias',
      href: '/admin/news',
      icon: FileText,
      permission: null
    },
    {
      title: 'Estudos Científicos',
      href: '/admin/studies',
      icon: BookOpen,
      permission: null
    },
    {
      title: 'Leads',
      href: '/admin/leads',
      icon: Bell,
      permission: UserPermission.MANAGE_CUSTOMERS
    },
    {
      title: 'Mensagens',
      href: '/admin/whatsapp',
      icon: MessageSquare,
      permission: null
    },
    {
      title: 'Emails',
      href: '/admin/email-templates',
      icon: FileText,
      permission: null
    },
    {
      title: 'Fretes',
      href: '/admin/shipping-rates',
      icon: ShoppingCart,
      permission: UserPermission.MANAGE_SETTINGS
    },
    {
      title: 'Sincronização',
      href: '/admin/sync',
      icon: RefreshCw,
      permission: UserPermission.MANAGE_INTEGRATIONS
    },
    {
      title: 'Segurança',
      href: '/admin/security',
      icon: Lock,
      permission: UserPermission.MANAGE_SETTINGS
    },
    {
      title: 'Suporte',
      href: '/admin/tickets',
      icon: MessageSquare,
      permission: UserPermission.MANAGE_SUPPORT
    }
  ];

  const sidebar = (
    <div className="flex h-full flex-col bg-white">
      <div className="px-3.5 py-2 flex items-center justify-between border-b">
        <Link to="/admin/dashboard" className="font-semibold text-lg">
          Bone Heal Admin
        </Link>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setOpen(false)}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      <ScrollArea className="flex-1 py-2">
        <nav className="grid gap-1 px-2">
          {navigation.map((item) => {
            // Verificar se o usuário tem permissão para acessar o item
            const hasAccess = item.permission === null || 
                             isAdminMaster || 
                             (item.permission && hasPermission(item.permission));
            
            if (!hasAccess) return null;
            
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
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

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block">
        <div className="h-screen w-64 border-r">
          {sidebar}
        </div>
      </div>
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-3 z-40"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            {sidebar}
          </SheetContent>
        </Sheet>
      </div>
      <main className="flex-1 bg-gray-50">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default Layout;
