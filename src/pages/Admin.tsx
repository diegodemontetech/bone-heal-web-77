
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/admin/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Users, ShoppingBag, Package, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth-context";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, isLoading, isAdmin, isAdminMaster } = useAuth();

  useEffect(() => {
    if (!isLoading && !profile) {
      navigate("/admin/login");
      return;
    }

    if (!isLoading && !isAdmin) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para acessar a área administrativa.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [isLoading, profile, isAdmin, navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // If we got here, the user is admin or admin master
  return (
    <Layout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-neutral-500 mt-1">Visão geral do sistema</p>
        </div>
        
        {isAdminMaster && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
            <p className="text-blue-700 text-sm">
              Você está conectado como Administrador Master e tem acesso completo ao sistema.
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base font-medium">Usuários</CardTitle>
              <Users className="h-4 w-4 text-neutral-500" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-neutral-500">Total de dentistas cadastrados</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base font-medium">Pedidos</CardTitle>
              <ShoppingBag className="h-4 w-4 text-neutral-500" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-neutral-500">Total de pedidos realizados</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base font-medium">Produtos</CardTitle>
              <Package className="h-4 w-4 text-neutral-500" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-neutral-500">Produtos no catálogo</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
