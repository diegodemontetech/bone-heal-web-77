
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import WhatsAppWidget from "@/components/WhatsAppWidget";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Verificar sessão existente
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        navigate("/products");
      }
    };

    checkSession();

    // Monitorar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("is_admin")
            .eq("id", session.user.id)
            .single();

          const destination = profile?.is_admin ? "/admin" : "/products";
          navigate(destination);
          
          toast({
            title: "Login realizado com sucesso!",
            description: profile?.is_admin ? "Bem-vindo à área administrativa." : "Bem-vindo à área do dentista.",
          });
        } catch (error) {
          console.error("Erro ao verificar perfil:", error);
          navigate("/products"); // Fallback para rota padrão
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

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
