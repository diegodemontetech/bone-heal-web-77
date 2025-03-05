
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [sessionLoading, setSessionLoading] = useState(true);
  const [hasValidSession, setHasValidSession] = useState(false);

  // Verificar a sessão do Supabase diretamente
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!error && data?.session) {
          setHasValidSession(true);
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
      } finally {
        setSessionLoading(false);
      }
    };
    
    checkSession();
  }, []);

  // Redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (!isLoading && !sessionLoading && !profile && !hasValidSession) {
      navigate("/login");
      return;
    }
  }, [isLoading, profile, navigate, sessionLoading, hasValidSession]);

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
  // pois pode estar em processo de sincronização
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto p-4 flex-1">
        <ProfileForm />
      </div>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default Profile;
