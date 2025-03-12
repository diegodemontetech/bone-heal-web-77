
import { ReactNode, Suspense } from "react";
import { useAuth } from "@/hooks/use-auth-context";
import { Navigate, useLocation } from "react-router-dom";

export const AdminLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export const AdminRoute = ({ children }: { children?: ReactNode }) => {
  const { profile, isAdmin } = useAuth();
  const location = useLocation();

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
