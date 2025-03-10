
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { UserPermission } from "@/types/auth";

// Order-related pages
const AdminOrders = lazy(() => import("@/pages/admin/Orders"));
const AdminQuotations = lazy(() => import("@/pages/admin/Quotations"));

// Loader para componentes com lazy loading
const AdminLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export const orderRoutes: RouteObject[] = [
  {
    path: "orders",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <ProtectedRoute requiredPermission={UserPermission.MANAGE_ORDERS}>
          <AdminOrders />
        </ProtectedRoute>
      </Suspense>
    )
  },
  {
    path: "quotations",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <ProtectedRoute requiredPermission={UserPermission.MANAGE_ORDERS}>
          <AdminQuotations />
        </ProtectedRoute>
      </Suspense>
    )
  }
];
