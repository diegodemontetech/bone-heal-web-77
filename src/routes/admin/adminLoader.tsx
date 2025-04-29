
import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/auth/auth-provider";

// Loading component for admin routes
export const AdminLoader = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
};

// Component to protect admin routes
export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isAdmin, isLoading } = useAuthContext();
  
  // Show loader while checking auth
  if (isLoading) {
    return <AdminLoader />;
  }
  
  // Redirect to login if not authenticated or not an admin
  if (!session || !isAdmin) {
    return <Navigate to="/login" replace />;
  }
  
  // User is an admin, render the protected route
  return <>{children}</>;
};
