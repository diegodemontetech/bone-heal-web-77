
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth-context";
import { useNavigate } from "react-router-dom";
import { Loader2, Users, ShoppingBag, Package, Activity } from "lucide-react";

const AdminDashboard = () => {
  const { isAdmin, profile, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate("/login");
    }
  }, [isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Painel Administrativo</h1>
        <p className="text-neutral-500 mt-1">Bem-vindo ao painel de controle Bone Heal</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-medium">Usuários</CardTitle>
            <Users className="h-4 w-4 text-neutral-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">-</p>
            <p className="text-sm text-neutral-500">Dentistas cadastrados</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-medium">Pedidos</CardTitle>
            <ShoppingBag className="h-4 w-4 text-neutral-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">-</p>
            <p className="text-sm text-neutral-500">Total de pedidos</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-medium">Produtos</CardTitle>
            <Package className="h-4 w-4 text-neutral-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">-</p>
            <p className="text-sm text-neutral-500">Produtos cadastrados</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-medium">Atividade</CardTitle>
            <Activity className="h-4 w-4 text-neutral-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">-</p>
            <p className="text-sm text-neutral-500">Ações recentes</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6">
        <Card className="bg-white border-none shadow-sm">
          <CardHeader className="border-b pb-3">
            <CardTitle className="text-base font-medium">Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-8">
              <p className="text-neutral-500 text-sm">Nenhuma atividade recente registrada</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
