
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { UserPermission } from "@/types/auth";

// Admin Users
const AdminUsers = lazy(() => import("@/pages/admin/Users"));
const AdminUserDetail = lazy(() => import("@/pages/admin/UserDetail"));

// Loader para componentes com lazy loading
const AdminLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export const userRoutes: RouteObject[] = [
  {
    path: "users",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <ProtectedRoute requiredPermission={UserPermission.MANAGE_USERS}>
          <AdminUsers />
        </ProtectedRoute>
      </Suspense>
    )
  },
  {
    path: "users/:id",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <ProtectedRoute requiredPermission={UserPermission.MANAGE_USERS}>
          <AdminUserDetail />
        </ProtectedRoute>
      </Suspense>
    )
  }
];
