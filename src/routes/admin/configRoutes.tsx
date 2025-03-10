
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { UserPermission } from "@/types/auth";

// Config-related pages
const AdminShippingRates = lazy(() => import("@/pages/admin/ShippingRates"));
const AdminSync = lazy(() => import("@/pages/admin/Sync"));
const AdminSecurity = lazy(() => import("@/pages/admin/Security"));

// Loader para componentes com lazy loading
const AdminLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export const configRoutes: RouteObject[] = [
  {
    path: "shipping-rates",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <ProtectedRoute requiredPermission={UserPermission.MANAGE_SETTINGS}>
          <AdminShippingRates />
        </ProtectedRoute>
      </Suspense>
    )
  },
  {
    path: "sync",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <ProtectedRoute requiredPermission={UserPermission.MANAGE_INTEGRATIONS}>
          <AdminSync />
        </ProtectedRoute>
      </Suspense>
    )
  },
  {
    path: "security",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <ProtectedRoute requiredPermission={UserPermission.MANAGE_SETTINGS}>
          <AdminSecurity />
        </ProtectedRoute>
      </Suspense>
    )
  }
];
