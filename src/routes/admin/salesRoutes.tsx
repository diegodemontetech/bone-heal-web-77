
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { UserPermission } from "@/types/auth";

const Quotations = lazy(() => import("@/pages/admin/Quotations"));
const CreateQuotation = lazy(() => import("@/components/admin/quotations/CreateQuotation"));

const AdminLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export const salesRoutes: RouteObject[] = [
  {
    path: "quotations",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <ProtectedRoute requiredPermission={UserPermission.MANAGE_ORDERS}>
          <Quotations />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: "quotations/new",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <ProtectedRoute requiredPermission={UserPermission.MANAGE_ORDERS}>
          <CreateQuotation onCancel={() => {}} onSuccess={() => {}} />
        </ProtectedRoute>
      </Suspense>
    ),
  }
];
