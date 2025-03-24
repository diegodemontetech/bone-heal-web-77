
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { UserPermission } from "@/types/auth";

// Admin Dashboard - Import directly instead of using lazy loading
import Dashboard from "@/pages/admin/Dashboard";
const AdminTickets = lazy(() => import("@/pages/admin/Tickets"));

// Loader for components with lazy loading
const AdminLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export const dashboardRoutes: RouteObject[] = [
  {
    path: "",
    element: <Dashboard />
  },
  {
    path: "dashboard",
    element: <Dashboard />
  },
  {
    path: "tickets",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <ProtectedRoute requiredPermission={UserPermission.MANAGE_SUPPORT}>
          <AdminTickets />
        </ProtectedRoute>
      </Suspense>
    )
  }
];
