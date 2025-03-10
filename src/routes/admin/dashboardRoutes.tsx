
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Admin Dashboard
const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));

// Loader para componentes com lazy loading
const AdminLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export const dashboardRoutes: RouteObject[] = [
  {
    path: "dashboard",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <Dashboard />
      </Suspense>
    )
  }
];
