
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth-context";
import { Loader2 } from "lucide-react";
import { UserPermission } from "@/types/auth";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: UserPermission;
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, requiredPermission, adminOnly = true }: ProtectedRouteProps) => {
  const { profile, isLoading, isAdmin, hasPermission } = useAuth();
  const location = useLocation();

  // Se ainda estiver carregando, mostra um loader
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Se não estiver autenticado, redireciona para o login com o caminho atual como state
  if (!profile) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  // Se for necessário ser admin e o usuário não for admin, redireciona para uma página de acesso negado
  if (adminOnly && !isAdmin) {
    return <Navigate to="/admin/login" state={{ accessDenied: true }} replace />;
  }

  // Se for necessária uma permissão específica e o usuário não tiver, redireciona
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/admin/dashboard" state={{ accessDenied: true }} replace />;
  }

  // Se passar por todas as verificações, renderiza o componente filho
  return <>{children}</>;
};

export default ProtectedRoute;
