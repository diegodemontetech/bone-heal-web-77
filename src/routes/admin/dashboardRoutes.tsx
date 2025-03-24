
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { UserPermission } from "@/types/auth";

// Admin Dashboard
const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AdminTickets = lazy(() => import("@/pages/admin/Tickets"));

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
