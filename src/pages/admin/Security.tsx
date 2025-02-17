
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Key, ShieldAlert } from "lucide-react";

const Security = () => {
  const [mpToken, setMpToken] = useState("");

  // Verificar se o usuário é admin
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) throw new Error("Não autenticado");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleUpdateMPToken = async () => {
    try {
      const { error } = await supabase.functions.invoke('update-secret', {
        body: {
          key: 'MP_ACCESS_TOKEN',
          value: mpToken
        }
      });

      if (error) throw error;

      toast.success("Token do Mercado Pago atualizado com sucesso!");
      setMpToken("");
    } catch (error) {
      console.error("Erro ao atualizar token:", error);
      toast.error("Erro ao atualizar token do Mercado Pago");
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile?.is_admin) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center gap-2 mb-6">
          <ShieldAlert className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold">Segurança</h1>
        </div>

        <div className="grid gap-6">
          {/* Mercado Pago */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-4 h-4" />
                Mercado Pago
              </CardTitle>
              <CardDescription>
                Configure as credenciais do Mercado Pago para processar pagamentos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mp_token">Access Token</Label>
                  <div className="flex gap-2">
                    <Input
                      id="mp_token"
                      type="password"
                      value={mpToken}
                      onChange={(e) => setMpToken(e.target.value)}
                      placeholder="TEST-0000000000000000-000000-00000000000000000000000000000000-000000000"
                    />
                    <Button onClick={handleUpdateMPToken}>
                      Atualizar
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>O token pode ser encontrado em:</p>
                  <ol className="list-decimal list-inside space-y-1 mt-2">
                    <li>Acesse sua conta Mercado Pago</li>
                    <li>Vá para Configurações {'>'} Credenciais</li>
                    <li>Copie o Access Token de Produção ou Teste</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Security;
