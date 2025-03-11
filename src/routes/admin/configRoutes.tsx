
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { UserPermission } from "@/types/auth";

// Admin pages
const AdminSecurity = lazy(() => import("@/pages/admin/Security"));
const AdminShippingRates = lazy(() => import("@/pages/admin/ShippingRates"));
const AdminVouchers = lazy(() => import("@/pages/admin/Vouchers"));
const AdminCommercialConditions = lazy(() => import("@/pages/admin/CommercialConditions"));

// Placeholder para páginas que ainda não foram implementadas
const PlaceholderPage = lazy(() => import("@/pages/admin/PlaceholderPage"));

// Loader para componentes com lazy loading
const AdminLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export const configRoutes: RouteObject[] = [
  {
    path: "security",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <ProtectedRoute requiredPermission={UserPermission.MANAGE_SETTINGS}>
          <AdminSecurity />
        </ProtectedRoute>
      </Suspense>
    )
  },
  {
    path: "shipping",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <ProtectedRoute requiredPermission={UserPermission.MANAGE_SETTINGS}>
          <AdminShippingRates />
        </ProtectedRoute>
      </Suspense>
    )
  },
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
    path: "vouchers",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <ProtectedRoute requiredPermission={UserPermission.MANAGE_PRODUCTS}>
          <AdminVouchers />
        </ProtectedRoute>
      </Suspense>
    )
  },
  {
    path: "commercial-conditions",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <ProtectedRoute requiredPermission={UserPermission.MANAGE_SETTINGS}>
          <AdminCommercialConditions />
        </ProtectedRoute>
      </Suspense>
    )
  },
  {
    path: "email-templates",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <ProtectedRoute requiredPermission={UserPermission.MANAGE_SETTINGS}>
          <PlaceholderPage title="Templates de Email" />
        </ProtectedRoute>
      </Suspense>
    )
  },
  {
    path: "sync",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <ProtectedRoute requiredPermission={UserPermission.MANAGE_SETTINGS}>
          <PlaceholderPage title="Sincronização" />
        </ProtectedRoute>
      </Suspense>
    )
  },
  {
    path: "api-evolution",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <ProtectedRoute requiredPermission={UserPermission.MANAGE_SETTINGS}>
          <PlaceholderPage title="API Evolution" />
        </ProtectedRoute>
      </Suspense>
    )
  },
  {
    path: "n8n",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <ProtectedRoute requiredPermission={UserPermission.MANAGE_SETTINGS}>
          <PlaceholderPage title="n8n" />
        </ProtectedRoute>
      </Suspense>
    )
  }
];
