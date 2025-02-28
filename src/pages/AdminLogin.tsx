
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(true);

  // Single check for existing session
  useEffect(() => {
    let isSubscribed = true;

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("No session found during initial check");
          if (isSubscribed) setIsChecking(false);
          return;
        }

        // Log the user information for debugging
        console.log("Session found during initial check:", session.user.email);

        // TEMPORARY WORKAROUND:
        // Hardcoded admin emails until RLS policy is fixed
        const adminEmails = ['boneheal.ti@gmail.com']; 
        const isAdmin = adminEmails.includes(session.user.email || '');

        console.log("Admin check (initial) - Email:", session.user.email, "Is admin:", isAdmin);

        if (isAdmin) {
          console.log("Admin access granted during initial check, redirecting to admin dashboard");
          if (isSubscribed) navigate("/admin");
        } else {
          console.log("User is not in admin list:", session.user.email);
          if (isSubscribed) {
            setIsChecking(false);
            toast({
              title: "Acesso negado",
              description: "Você não tem permissão para acessar a área administrativa.",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
        if (isSubscribed) setIsChecking(false);
      }
    };

    checkSession();

    // Cleanup function
    return () => {
      isSubscribed = false;
    };
  }, [navigate, toast]);

  // Auth state change listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, "User:", session?.user?.email);
      
      if (event === "SIGNED_IN" && session) {
        try {
          console.log("Sign in detected, checking admin status");
          
          // TEMPORARY WORKAROUND:
          // Hardcoded admin emails until RLS policy is fixed
          const adminEmails = ['boneheal.ti@gmail.com']; 
          const isAdmin = adminEmails.includes(session.user.email || '');

          console.log("Admin check (after sign in) - Email:", session.user.email, "Is admin:", isAdmin);

          if (isAdmin) {
            console.log("Admin login confirmed, navigating to admin dashboard");
            toast({
              title: "Login bem-sucedido",
              description: "Bem-vindo à área administrativa!",
            });
            navigate("/admin");
          } else {
            console.log("User is not an admin:", session.user.email);
            toast({
              title: "Acesso negado",
              description: "Você não tem permissão para acessar a área administrativa.",
              variant: "destructive",
            });
            await supabase.auth.signOut();
          }
        } catch (error) {
          console.error("Error checking admin status after sign in:", error);
          toast({
            title: "Erro",
            description: "Ocorreu um erro ao verificar suas permissões.",
            variant: "destructive",
          });
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-center mb-8">Área Administrativa</h1>
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
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
