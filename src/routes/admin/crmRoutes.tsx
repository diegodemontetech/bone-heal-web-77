
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { UserPermission } from "@/types/auth";

// CRM-related pages
const CRMPage = lazy(() => import("@/pages/admin/CRM"));
const HuntingAtivo = lazy(() => import("@/pages/admin/HuntingAtivo"));
const CarteiraClientes = lazy(() => import("@/pages/admin/CarteiraClientes"));

// Loader para componentes com lazy loading
const AdminLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export const crmRoutes: RouteObject[] = [
  {
    path: "crm",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <ProtectedRoute requiredPermission={UserPermission.MANAGE_CUSTOMERS}>
          <CRMPage />
        </ProtectedRoute>
      </Suspense>
    )
  },
  {
    path: "crm/hunting",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <ProtectedRoute requiredPermission={UserPermission.MANAGE_CUSTOMERS}>
          <HuntingAtivo />
        </ProtectedRoute>
      </Suspense>
    )
  },
  {
    path: "crm/carteira",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <ProtectedRoute requiredPermission={UserPermission.MANAGE_CUSTOMERS}>
          <CarteiraClientes />
        </ProtectedRoute>
      </Suspense>
    )
  }
];
