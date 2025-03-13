
import { useState, useEffect, useCallback } from "react";
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

  // Função para verificar a sessão, extraída para poder ser chamada novamente
  const checkSession = useCallback(async () => {
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
      } else {
        // Se não houve erro, desligue o flag de erro de conexão
        setConnectionError(false);
        setCurrentSession(data.session);
        setSessionLoading(false);
      }
    } catch (error) {
      console.error("Erro ao verificar sessão:", error);
      setConnectionError(true);
      setSessionLoading(false);
    }
  }, [connectionRetries]);

  // Verificar a sessão atual usando diretamente o cliente Supabase
  useEffect(() => {
    // Define um timeout mais curto para a verificação da sessão (8 segundos)
    const timeoutId = setTimeout(() => {
      if (sessionLoading) {
        console.log("Timeout da verificação de sessão");
        setSessionLoading(false);
        
        // Se ainda estamos carregando após o timeout, verifique a conexão
        if (!navigator.onLine) {
          setConnectionError(true);
          toast.error("Sem conexão com a internet. Verifique sua rede.");
        } else {
          setConnectionError(true);
          toast.error("Tempo limite excedido. O servidor pode estar temporariamente indisponível.");
        }
      }
    }, 8000);
    
    checkSession();
    
    // Adicionar listeners para eventos de conexão
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkSession]);

  // Função para lidar com evento de conexão reestabelecida
  const handleOnline = useCallback(() => {
    console.log("Conexão restaurada");
    if (connectionError) {
      setConnectionError(false);
      setConnectionRetries(0);
      setSessionLoading(true);
      // Recarrega a página para reiniciar o processo de autenticação
      window.location.reload();
    }
  }, [connectionError]);

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
  const retryConnection = useCallback(() => {
    setConnectionError(false);
    setConnectionRetries(0);
    setSessionLoading(true);
    checkSession();
  }, [checkSession]);

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

// Declaração para TypeScript reconhecer a variável global
declare global {
  interface Window {
    adminSessionBeforeSignUp: any;
  }
}
