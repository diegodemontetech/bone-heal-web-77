
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/admin/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          console.log("No session found, redirecting to admin login");
          navigate("/admin/login");
          return;
        }

        console.log("Session found:", session.user.email);

        // TEMPORARY WORKAROUND:
        // Check if the user email is in the hardcoded admin list
        const adminEmails = ['boneheal.ti@gmail.com']; // Add any other admin emails here
        const isAdmin = adminEmails.includes(session.user.email || '');

        console.log("Admin check workaround - Email:", session.user.email, "Is admin:", isAdmin);

        if (!isAdmin) {
          console.log("User is not in admin list, redirecting to admin login");
          toast({
            title: "Acesso negado",
            description: "Você não tem permissão para acessar a área administrativa.",
            variant: "destructive",
          });
          navigate("/admin/login");
          return;
        }

        setAdminEmail(session.user.email);
        console.log("Admin access granted for:", session.user.email);
        setIsLoading(false);
      } catch (error) {
        console.error("Error in admin check:", error);
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao verificar suas permissões. Por favor, tente novamente.",
          variant: "destructive",
        });
        navigate("/admin/login");
      }
    };

    checkAdminStatus();
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Layout adminEmail={adminEmail}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Total de dentistas cadastrados</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Total de pedidos realizados</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Produtos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Produtos no catálogo</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
