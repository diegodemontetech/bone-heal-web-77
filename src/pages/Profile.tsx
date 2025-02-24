
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";

interface Profile {
  id: string;
  full_name: string;
  specialty?: string;
  crm: string;
  phone?: string;
  address?: string;
}

const Profile = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error: any) {
        toast({
          title: "Erro ao carregar perfil",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, toast]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session?.user?.id) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive",
      });
      return;
    }

    if (!profile?.crm) {
      toast({
        title: "Erro",
        description: "CRO Responsável é obrigatório",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile?.full_name,
          specialty: profile?.specialty,
          crm: profile?.crm,
          phone: profile?.phone,
          address: profile?.address,
        })
        .eq("id", session.user.id);

      if (error) throw error;

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto p-4 flex items-center justify-center flex-1">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
        <WhatsAppWidget />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="container mx-auto p-4 flex-1">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Meu Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="full_name">Nome Completo</Label>
                <Input
                  id="full_name"
                  value={profile?.full_name || ""}
                  onChange={(e) => setProfile(prev => ({ ...prev!, full_name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialty">Especialidade</Label>
                <Input
                  id="specialty"
                  value={profile?.specialty || ""}
                  onChange={(e) => setProfile(prev => ({ ...prev!, specialty: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="crm">CRO Responsável</Label>
                <Input
                  id="crm"
                  value={profile?.crm || ""}
                  onChange={(e) => setProfile(prev => ({ ...prev!, crm: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={profile?.phone || ""}
                  onChange={(e) => setProfile(prev => ({ ...prev!, phone: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={profile?.address || ""}
                  onChange={(e) => setProfile(prev => ({ ...prev!, address: e.target.value }))}
                />
              </div>

              <Button type="submit" disabled={isSaving} className="w-full">
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Alterações"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default Profile;
