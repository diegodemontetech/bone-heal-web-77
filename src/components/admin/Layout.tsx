
import React, { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronRight,
  Store,
  Package,
  ShoppingCart,
  Users,
  Settings,
  BarChart3,
  FileText,
  MessageSquare,
  LogOut,
  LifeBuoy,
  Truck,
  TagIcon,
  Sync,
  Newspaper,
  Microscope,
  User,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth-context";
import { UserPermission } from "@/types/auth";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const { profile, signOut, hasPermission, isAdminMaster } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r">
          <div className="flex items-center flex-shrink-0 px-4 mb-5">
            <Link to="/admin" className="flex items-center">
              <h1 className="text-xl font-bold">Bone Heal Admin</h1>
            </Link>
          </div>

          <ScrollArea className="flex-1 px-3">
            <div className="space-y-1">
              <p className="px-4 pt-5 text-xs font-semibold text-gray-400 uppercase">
                Principal
              </p>

              <Link to="/admin">
                <Button variant="ghost" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-3" />
                  Dashboard
                </Button>
              </Link>

              {(isAdminMaster || hasPermission(UserPermission.MANAGE_PRODUCTS)) && (
                <Link to="/admin/products">
                  <Button variant="ghost" className="w-full justify-start">
                    <Package className="w-4 h-4 mr-3" />
                    Produtos
                  </Button>
                </Link>
              )}

              {(isAdminMaster || hasPermission(UserPermission.MANAGE_ORDERS)) && (
                <Link to="/admin/orders">
                  <Button variant="ghost" className="w-full justify-start">
                    <ShoppingCart className="w-4 h-4 mr-3" />
                    Pedidos
                  </Button>
                </Link>
              )}

              {(isAdminMaster || hasPermission(UserPermission.MANAGE_CUSTOMERS)) && (
                <Link to="/admin/customers">
                  <Button variant="ghost" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-3" />
                    Clientes
                  </Button>
                </Link>
              )}

              {(isAdminMaster || hasPermission(UserPermission.MANAGE_USERS)) && (
                <Link to="/admin/users">
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="w-4 h-4 mr-3" />
                    Usuários
                  </Button>
                </Link>
              )}

              <p className="px-4 pt-5 text-xs font-semibold text-gray-400 uppercase">
                Catálogo
              </p>

              {(isAdminMaster || hasPermission(UserPermission.MANAGE_PRODUCTS)) && (
                <>
                  <Link to="/admin/studies">
                    <Button variant="ghost" className="w-full justify-start">
                      <Microscope className="w-4 h-4 mr-3" />
                      Estudos Científicos
                    </Button>
                  </Link>

                  <Link to="/admin/news">
                    <Button variant="ghost" className="w-full justify-start">
                      <Newspaper className="w-4 h-4 mr-3" />
                      Notícias
                    </Button>
                  </Link>
                </>
              )}

              <p className="px-4 pt-5 text-xs font-semibold text-gray-400 uppercase">
                Marketing
              </p>

              {(isAdminMaster || hasPermission(UserPermission.MANAGE_SETTINGS)) && (
                <>
                  <Link to="/admin/vouchers">
                    <Button variant="ghost" className="w-full justify-start">
                      <TagIcon className="w-4 h-4 mr-3" />
                      Cupons
                    </Button>
                  </Link>

                  <Link to="/admin/whatsapp">
                    <Button variant="ghost" className="w-full justify-start">
                      <MessageSquare className="w-4 h-4 mr-3" />
                      WhatsApp
                    </Button>
                  </Link>
                </>
              )}

              <p className="px-4 pt-5 text-xs font-semibold text-gray-400 uppercase">
                Integrações
              </p>

              {(isAdminMaster || hasPermission(UserPermission.MANAGE_INTEGRATIONS)) && (
                <>
                  <Link to="/admin/sync">
                    <Button variant="ghost" className="w-full justify-start">
                      <Sync className="w-4 h-4 mr-3" />
                      Sincronização Omie
                    </Button>
                  </Link>

                  <Link to="/admin/shipping-rates">
                    <Button variant="ghost" className="w-full justify-start">
                      <Truck className="w-4 h-4 mr-3" />
                      Fretes
                    </Button>
                  </Link>
                </>
              )}

              <p className="px-4 pt-5 text-xs font-semibold text-gray-400 uppercase">
                Sistema
              </p>

              {isAdminMaster && (
                <Link to="/admin/security">
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-3" />
                    Segurança
                  </Button>
                </Link>
              )}

              <Link to="/admin/leads">
                <Button variant="ghost" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-3" />
                  Leads
                </Button>
              </Link>

              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-3" />
                Sair
              </Button>
            </div>
          </ScrollArea>

          <div className="p-4 mt-auto border-t">
            <div className="flex items-center">
              <div className="ml-3">
                <p className="text-sm font-medium">{profile?.full_name}</p>
                <p className="text-xs text-gray-500">{profile?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
