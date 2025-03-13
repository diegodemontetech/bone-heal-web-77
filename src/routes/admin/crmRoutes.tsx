
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { UserPermission } from "@/types/auth";

// CRM pages
const LeadsKanban = lazy(() => import("@/components/admin/kanban/LeadsKanban"));
const CRMConfigPage = lazy(() => import("@/components/admin/crm/config/CRMConfigPage"));

// Loader para componentes com lazy loading
const AdminLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export const crmRoutes: RouteObject[] = [
  {
    path: "leads/kanban",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <ProtectedRoute requiredPermission={UserPermission.MANAGE_LEADS}>
          <LeadsKanban />
        </ProtectedRoute>
      </Suspense>
    )
  },
  {
    path: "configuracoes",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <ProtectedRoute requiredPermission={UserPermission.MANAGE_LEADS}>
          <CRMConfigPage />
        </ProtectedRoute>
      </Suspense>
    )
  }
];
