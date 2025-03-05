
import { useEffect } from "react";
import Layout from "@/components/admin/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth-context";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

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
    <Layout>
      <div className="container p-6">
        <h1 className="text-2xl font-bold mb-6">Painel Administrativo</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">-</p>
              <p className="text-sm text-muted-foreground">Dentistas cadastrados</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">-</p>
              <p className="text-sm text-muted-foreground">Total de pedidos</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Produtos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">-</p>
              <p className="text-sm text-muted-foreground">Produtos cadastrados</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Nenhuma atividade recente.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
