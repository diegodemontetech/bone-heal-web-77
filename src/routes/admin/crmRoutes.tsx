
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { UserPermission } from "@/types/auth";
import AdminLayout from "@/components/admin/Layout";

// CRM-related pages
const AdminLeads = lazy(() => import("@/pages/admin/Leads"));
const LeadsKanbanPage = lazy(() => import("@/pages/admin/LeadsKanban"));

// Loader para componentes com lazy loading
const AdminLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export const crmRoutes: RouteObject[] = [
  {
    path: "leads",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <ProtectedRoute requiredPermission={UserPermission.MANAGE_CUSTOMERS}>
          <AdminLayout>
            <AdminLeads />
          </AdminLayout>
        </ProtectedRoute>
      </Suspense>
    )
  },
  {
    path: "leads/kanban",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <ProtectedRoute requiredPermission={UserPermission.MANAGE_CUSTOMERS}>
          <AdminLayout>
            <LeadsKanbanPage />
          </AdminLayout>
        </ProtectedRoute>
      </Suspense>
    )
  }
];
