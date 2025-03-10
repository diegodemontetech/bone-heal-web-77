
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { UserPermission } from "@/types/auth";

// CRM-related pages
const AdminLeads = lazy(() => import("@/pages/admin/Leads"));
const AdminLeadsKanban = lazy(() => import("@/pages/admin/LeadsKanban"));
const AdminWhatsapp = lazy(() => import("@/pages/admin/Whatsapp"));
const AdminEmailTemplates = lazy(() => import("@/pages/admin/EmailTemplates"));

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
          <AdminLeads />
        </ProtectedRoute>
      </Suspense>
    )
  },
  {
    path: "leads-kanban",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <ProtectedRoute requiredPermission={UserPermission.MANAGE_CUSTOMERS}>
          <AdminLeadsKanban />
        </ProtectedRoute>
      </Suspense>
    )
  },
  {
    path: "whatsapp",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <AdminWhatsapp />
      </Suspense>
    )
  },
  {
    path: "email-templates",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <AdminEmailTemplates />
      </Suspense>
    )
  }
];
