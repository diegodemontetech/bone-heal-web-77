
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { UserPermission } from "@/types/auth";

// Config Pages
const Settings = lazy(() => import("@/pages/admin/Settings"));
const Security = lazy(() => import("@/pages/admin/Security"));
const ShippingRates = lazy(() => import("@/pages/admin/ShippingRates"));
const N8n = lazy(() => import("@/pages/admin/N8n"));
const ApiEvolution = lazy(() => import("@/pages/admin/ApiEvolution"));

// Loading
const AdminLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export const configRoutes: RouteObject[] = [
  {
    path: "settings",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <ProtectedRoute requiredPermission={UserPermission.MANAGE_SETTINGS}>
          <Settings />
        </ProtectedRoute>
      </Suspense>
    )
  },
  {
    path: "security",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <ProtectedRoute requiredPermission={UserPermission.MANAGE_SETTINGS}>
          <Security />
        </ProtectedRoute>
      </Suspense>
    )
  },
  {
    path: "shipping-rates",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <ProtectedRoute requiredPermission={UserPermission.MANAGE_SETTINGS}>
          <ShippingRates />
        </ProtectedRoute>
      </Suspense>
    )
  },
  {
    path: "n8n",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <ProtectedRoute requiredPermission={UserPermission.MANAGE_INTEGRATIONS}>
          <N8n />
        </ProtectedRoute>
      </Suspense>
    )
  },
  {
    path: "api-evolution",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <ProtectedRoute requiredPermission={UserPermission.MANAGE_INTEGRATIONS}>
          <ApiEvolution />
        </ProtectedRoute>
      </Suspense>
    )
  }
];
