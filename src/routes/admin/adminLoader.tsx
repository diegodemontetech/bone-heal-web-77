
import { ReactNode, Suspense } from "react";
import { useAuth } from "@/hooks/use-auth-context";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

export const AdminLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="flex flex-col items-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="mt-4 text-sm text-muted-foreground">Carregando o painel administrativo...</p>
    </div>
  </div>
);

export const AdminRoute = ({ children }: { children?: ReactNode }) => {
  const { profile, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <AdminLoader />;
  }

  if (!profile) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <Suspense fallback={<AdminLoader />}>
      {children}
    </Suspense>
  );
};

export const withAdminLoader = (Component: React.ComponentType) => {
  return (props: any) => (
    <Suspense fallback={<AdminLoader />}>
      <Component {...props} />
    </Suspense>
  );
};
