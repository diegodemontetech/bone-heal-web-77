
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { UserPermission } from "@/types/auth";

const Orders = lazy(() => import("@/pages/admin/Orders"));
const CreateOrder = lazy(() => import("@/components/admin/CreateOrder"));

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
          <Orders />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: "orders/new",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <ProtectedRoute requiredPermission={UserPermission.MANAGE_ORDERS}>
          <CreateOrder onCancel={() => {}} />
        </ProtectedRoute>
      </Suspense>
    ),
  }
];
