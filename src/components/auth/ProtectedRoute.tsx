
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth-context";
import { Loader2 } from "lucide-react";
import { UserPermission } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: UserPermission;
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, requiredPermission, adminOnly = true }: ProtectedRouteProps) => {
  const { profile, isLoading, isAdmin, hasPermission } = useAuth();
  const location = useLocation();
  const [sessionChecked, setSessionChecked] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setHasSession(!!data.session);
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
      } finally {
        setSessionChecked(true);
      }
    };
    
    checkSession();
  }, []);

  // Se ainda estiver carregando, mostra um loader
  if (isLoading || !sessionChecked) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-sm text-gray-500">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, redireciona para o login com o caminho atual como state
  if (!profile && !hasSession) {
    console.log("Usuário não autenticado, redirecionando para login");
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  // Se for necessário ser admin e o usuário não for admin, redireciona para uma página de acesso negado
  if (adminOnly && !isAdmin) {
    console.log("Usuário não é admin, redirecionando para página de acesso negado");
    return <Navigate to="/admin/login" state={{ accessDenied: true }} replace />;
  }

  // Se for necessária uma permissão específica e o usuário não tiver, redireciona
  if (requiredPermission && !hasPermission(requiredPermission)) {
    console.log("Usuário não tem permissão necessária, redirecionando para dashboard");
    return <Navigate to="/admin/dashboard" state={{ accessDenied: true }} replace />;
  }

  // Se passar por todas as verificações, renderiza o componente filho
  return <>{children}</>;
};

export default ProtectedRoute;
