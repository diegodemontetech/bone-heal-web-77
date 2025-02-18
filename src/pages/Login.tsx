
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RegistrationForm from "@/components/auth/RegistrationForm";
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import WhatsAppWidget from "@/components/WhatsAppWidget";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Simplificar a verificação de sessão
  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  // Remover a query de perfil separada e incluir na verificação de auth
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === "SIGNED_IN") {
        if (!session?.user?.id) return;

        try {
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("is_admin")
            .eq("id", session.user.id)
            .single();

          if (error) throw error;

          // Redirecionar imediatamente com base no perfil
          if (profile?.is_admin) {
            navigate("/admin");
          } else {
            navigate("/products");
          }

          toast({
            title: "Login realizado com sucesso!",
            description: profile?.is_admin ? "Bem-vindo à área administrativa." : "Bem-vindo à área do dentista.",
          });
        } catch (error: any) {
          console.error("Error after sign in:", error);
          toast({
            title: "Erro ao carregar perfil",
            description: error.message || "Ocorreu um erro ao carregar seu perfil.",
            variant: "destructive",
          });
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (session?.user) {
      navigate("/products");
    }
  }, [session, navigate]);

  if (isSessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleTabChange = () => {
    const registerTab = document.querySelector('[value="register"]') as HTMLButtonElement;
    if (registerTab) {
      registerTab.click();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-32">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-center mb-8">Área do Dentista</h1>
          
          <Tabs defaultValue="login" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Cadastrar</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Auth
                supabaseClient={supabase}
                appearance={{
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: '#8B1F41',
                        brandAccent: '#4A0404',
                      },
                    },
                  },
                }}
                localization={{
                  variables: {
                    sign_in: {
                      email_label: 'Email',
                      password_label: 'Senha',
                      button_label: 'Entrar',
                      loading_button_label: 'Entrando...',
                      email_input_placeholder: 'Seu email',
                      password_input_placeholder: 'Sua senha',
                    },
                  },
                }}
                providers={[]}
                view="sign_in"
              />
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Não tem uma conta ainda?{" "}
                  <button
                    onClick={handleTabChange}
                    className="text-primary hover:underline"
                  >
                    Cadastre-se aqui
                  </button>
                </p>
              </div>
            </TabsContent>

            <TabsContent value="register">
              <RegistrationForm />
            </TabsContent>
          </Tabs>

          <Alert className="mt-4">
            <AlertDescription>
              Se você acabou de se registrar, verifique seu email para confirmar sua conta antes de fazer login.
            </AlertDescription>
          </Alert>
        </div>
      </div>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default Login;
