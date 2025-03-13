
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
  const [connectionRetries, setConnectionRetries] = useState(0);

  // Obter o caminho de redirecionamento da navegação
  const fromPath = location.state?.from || location.pathname;

  // Verificar a sessão atual usando diretamente o cliente Supabase
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Verifica primeiro se o navegador está online
        if (!navigator.onLine) {
          console.error("Navegador está offline");
          setConnectionError(true);
          setSessionLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erro ao verificar sessão:", error);
          
          // Se já tentamos algumas vezes sem sucesso, considere como erro de conexão
          if (connectionRetries >= 2) {
            setConnectionError(true);
            toast.error("Não foi possível conectar ao servidor. Verifique sua conexão.");
          } else {
            // Incrementa contagem de tentativas e tenta novamente em 1.5 segundos
            setConnectionRetries(prev => prev + 1);
            setTimeout(checkSession, 1500);
          }
        } else if (data.session) {
          console.log("Sessão ativa encontrada:", data.session);
          setCurrentSession(data.session);
          setConnectionError(false);
        } else {
          console.log("Nenhuma sessão ativa encontrada");
          setConnectionError(false);
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
        setConnectionError(true);
      } finally {
        if (connectionRetries >= 2) {
          setSessionLoading(false);
        }
      }
    };
    
    // Define um timeout mais curto para a verificação da sessão (3 segundos)
    const timeoutId = setTimeout(() => {
      if (sessionLoading) {
        console.log("Timeout da verificação de sessão");
        setSessionLoading(false);
        
        // Verifica se realmente é um problema de conexão ou apenas lentidão
        if (navigator.onLine) {
          setConnectionError(true);
          toast.error("Tempo limite excedido. O servidor pode estar temporariamente indisponível.");
        } else {
          setConnectionError(true);
          toast.error("Sem conexão com a internet. Verifique sua rede.");
        }
      }
    }, 5000); // Aumentado para 5 segundos para dar mais tempo em conexões mais lentas
    
    checkSession();
    
    // Adicionar listeners para eventos de conexão
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Função para lidar com evento de conexão reestabelecida
  const handleOnline = () => {
    console.log("Conexão restaurada");
    if (connectionError) {
      setConnectionError(false);
      setConnectionRetries(0);
      setSessionLoading(true);
      // Recarrega a página para reiniciar o processo de autenticação
      window.location.reload();
    }
  };

  // Função para lidar com evento de perda de conexão
  const handleOffline = () => {
    console.log("Conexão perdida");
    setConnectionError(true);
    toast.error("Conexão com a internet perdida");
  };

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

  // Função para tentar novamente a conexão
  const retryConnection = () => {
    setConnectionError(false);
    setConnectionRetries(0);
    setSessionLoading(true);
    window.location.reload();
  };

  return {
    isLoading: isLoading || sessionLoading,
    sessionLoading,
    profile,
    currentSession,
    isAuthenticated: !!profile?.id || !!currentSession?.user?.id,
    connectionError,
    retryConnection
  };
};
