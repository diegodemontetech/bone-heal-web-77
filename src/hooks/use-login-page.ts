
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth-context";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, profile, isAdmin } = useAuth();
  const [sessionLoading, setSessionLoading] = useState(true);
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  const [connectionError, setConnectionError] = useState(false);

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
        setConnectionError(true);
        toast.error("Erro de conexão com o servidor. Verifique sua internet e tente novamente.");
      } finally {
        setSessionLoading(false);
      }
    };
    
    // Define um timeout mais curto para a verificação da sessão (3 segundos)
    const timeoutId = setTimeout(() => {
      if (sessionLoading) {
        console.log("Timeout da verificação de sessão");
        setSessionLoading(false);
        setConnectionError(true);
        toast.error("Tempo limite excedido ao verificar sessão. Tente novamente.");
      }
    }, 3000); // Reduzido de 5 para 3 segundos
    
    checkSession();
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Verificar se o usuário está autenticado e redirecionar apropriadamente
  useEffect(() => {
    // Evitar múltiplas tentativas de redirecionamento
    if (redirectAttempted) return;

    // Se há um erro de conexão, não tentamos redirecionar
    if (connectionError) return;

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
        // Não redirecionamos para a própria página de login (evitar loop)
        const targetPath = fromPath === "/login" ? "/" : fromPath;
        console.log(`Redirecionando usuário normal para: ${targetPath}`);
        navigate(targetPath);
      }
    }
  }, [isLoading, profile, isAdmin, navigate, fromPath, sessionLoading, currentSession, redirectAttempted, connectionError]);

  return {
    isLoading: isLoading || sessionLoading,
    sessionLoading,
    profile,
    currentSession,
    isAuthenticated: !!profile?.id || !!currentSession?.user?.id,
    connectionError
  };
};
