
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { isAdmin, loading, user } = useAuth();

  // Redirect if user is already logged in
  useEffect(() => {
    if (!loading) {
      if (user && isAdmin) {
        navigate("/admin");
      } else if (user && !isAdmin) {
        navigate("/");
      }
    }
  }, [loading, user, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // If not loading and no user is logged in, show login form
  if (!user) {
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
  }

  return null;
};

export default AdminLogin;
