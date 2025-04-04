
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { useAuth } from "@/hooks/use-auth-context";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const { profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sessionLoading, setSessionLoading] = useState(true);
  const [hasValidSession, setHasValidSession] = useState(false);
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  const [sessionCheckComplete, setSessionCheckComplete] = useState(false);

  // Verificar a sessão do Supabase diretamente
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!error && data?.session) {
          console.log("Sessão válida encontrada em Profile:", data.session);
          setHasValidSession(true);
        } else {
          console.log("Nenhuma sessão válida encontrada em Profile");
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
      } finally {
        setSessionLoading(false);
        setSessionCheckComplete(true);
      }
    };
    
    checkSession();
  }, []);

  // Redirecionar para login se não estiver autenticado
  useEffect(() => {
    // Só verificamos após completar as duas verificações (profile e sessão)
    if (!sessionCheckComplete || isLoading) return;
    
    // Evitar múltiplas tentativas de redirecionamento
    if (redirectAttempted) return;
    
    // Se não há autenticação por nenhum dos métodos, redirecionar para login
    if (!profile && !hasValidSession) {
      console.log("Usuário não autenticado em Profile, redirecionando para login");
      setRedirectAttempted(true);
      navigate("/login", { state: { from: location.pathname } });
    }
  }, [isLoading, profile, navigate, sessionLoading, hasValidSession, location.pathname, redirectAttempted, sessionCheckComplete]);

  // Mostrar loading enquanto verificamos autenticação
  if (isLoading || sessionLoading) {
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

  // Se não tem perfil mas tem sessão válida, ainda mostrar o formulário de perfil
  if (!profile && hasValidSession) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto p-4 flex-1">
          <div className="flex flex-col items-center justify-center p-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-center text-gray-600">
              Carregando seu perfil. Por favor, aguarde...
            </p>
          </div>
        </div>
        <Footer />
        <WhatsAppWidget />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-4 flex-1">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-6 md:p-8">
          <ProfileForm />
        </div>
      </div>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default Profile;
