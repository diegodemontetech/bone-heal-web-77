import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: specialties } = useQuery({
    queryKey: ["dental-specialties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dental_specialties")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/products");
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo à área do dentista.",
        });
        navigate("/products");
      }
    });

    checkUser();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-32">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-center mb-8">Área do Dentista</h1>
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
              className: {
                container: 'auth-container',
                button: 'auth-button',
                input: 'auth-input',
                label: 'auth-label',
              },
            }}
            localization={{
              variables: {
                sign_up: {
                  email_label: 'Email',
                  password_label: 'Senha',
                  button_label: 'Cadastrar',
                  loading_button_label: 'Cadastrando...',
                  social_provider_text: 'Entrar com {{provider}}',
                  link_text: 'Não tem uma conta? Cadastre-se',
                },
                sign_in: {
                  email_label: 'Email',
                  password_label: 'Senha',
                  button_label: 'Entrar',
                  loading_button_label: 'Entrando...',
                  social_provider_text: 'Entrar com {{provider}}',
                  link_text: 'Já tem uma conta? Entre',
                },
              },
            }}
            providers={[]}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;