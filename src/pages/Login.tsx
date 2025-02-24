
import { useEffect, useState } from "react";
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
import { Loader2, ArrowRight } from "lucide-react";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("is_admin")
            .eq("id", session.user.id)
            .single();

          if (profile?.is_admin) {
            navigate("/admin");
          } else {
            navigate("/products");
          }
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);

      if (event === "SIGNED_IN" && session?.user) {
        try {
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("is_admin")
            .eq("id", session.user.id)
            .single();

          if (error) throw error;

          const destination = profile?.is_admin ? "/admin" : "/products";
          
          toast({
            title: "Login realizado com sucesso!",
            description: profile?.is_admin ? "Bem-vindo à área administrativa." : "Bem-vindo à área do cliente.",
          });

          navigate(destination);
        } catch (error: any) {
          console.error("Erro ao verificar perfil:", error);
          toast({
            title: "Erro ao carregar perfil",
            description: "Ocorreu um erro ao carregar seu perfil. Redirecionando para a área padrão.",
            variant: "destructive",
          });
          navigate("/products");
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Área do Cliente
              </h1>
              <p className="text-gray-600">
                Faça login ou crie sua conta para começar
              </p>
            </motion.div>
            
            <Tabs defaultValue="login" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 gap-4 rounded-lg p-1">
                <TabsTrigger 
                  value="login"
                  className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  Entrar
                </TabsTrigger>
                <TabsTrigger 
                  value="register"
                  className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  Seja Cliente
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
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
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <RegistrationForm />
                </motion.div>
              </TabsContent>
            </Tabs>

            <Alert className="mt-6">
              <AlertDescription>
                Se você acabou de se registrar, verifique seu email para confirmar sua conta antes de fazer login.
              </AlertDescription>
            </Alert>
          </div>
        </motion.div>
      </div>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default Login;
