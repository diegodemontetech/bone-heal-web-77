
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth-context";
import { supabase } from "@/integrations/supabase/client";

export const useLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, profile, isAdmin } = useAuth();
  const [sessionLoading, setSessionLoading] = useState(true);
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [redirectAttempted, setRedirectAttempted] = useState(false);

  // Obter o caminho de redirecionamento da navegação
  const fromPath = location.state?.from || location.pathname;

  // Verificar a sessão atual usando diretamente o cliente Supabase
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!error && data.session) {
          console.log("Sessão ativa encontrada:", data.session);
          setCurrentSession(data.session);
        } else {
          console.log("Nenhuma sessão ativa encontrada");
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
      } finally {
        setSessionLoading(false);
      }
    };
    
    checkSession();
  }, []);

  // Verificar se o usuário está autenticado e redirecionar apropriadamente
  useEffect(() => {
    // Evitar múltiplas tentativas de redirecionamento
    if (redirectAttempted) return;

    // Esperar até que tanto o profile quanto a sessão tenham sido verificados
    if (isLoading || sessionLoading) return;
    
    // Se temos um profile OU uma sessão válida, o usuário está autenticado
    const isAuthenticated = profile?.id || currentSession?.user?.id;
    
    if (isAuthenticated) {
      console.log("Usuário autenticado:", profile || currentSession?.user, "isAdmin:", isAdmin);
      setRedirectAttempted(true);
      
      // Verificar o tipo de usuário e redirecionar
      if (isAdmin) {
        console.log("Redirecionando admin para /admin/dashboard");
        navigate("/admin/dashboard");
      } else {
        // Não redirecionamos para /profile, mas sim para a página onde o usuário estava
        // Não redirecionamos para a própria página de login (evitar loop)
        const targetPath = fromPath === "/login" ? "/" : fromPath;
        console.log(`Redirecionando usuário normal para: ${targetPath}`);
        navigate(targetPath);
      }
    }
  }, [isLoading, profile, isAdmin, navigate, fromPath, sessionLoading, currentSession, redirectAttempted]);

  return {
    isLoading,
    sessionLoading,
    profile,
    currentSession,
    isAuthenticated: !!profile?.id || !!currentSession?.user?.id
  };
};
