
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { UserPermission } from "@/types/auth";

// Product-related pages
const AdminProducts = lazy(() => import("@/pages/admin/Products"));
const AdminVouchers = lazy(() => import("@/pages/admin/Vouchers"));
const AdminProductForm = lazy(() => import("@/pages/admin/ProductForm"));

// Loader para componentes com lazy loading
const AdminLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export const productRoutes: RouteObject[] = [
  {
    path: "products",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <ProtectedRoute requiredPermission={UserPermission.MANAGE_PRODUCTS}>
          <AdminProducts />
        </ProtectedRoute>
      </Suspense>
    )
  },
  {
    path: "products/add",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <ProtectedRoute requiredPermission={UserPermission.MANAGE_PRODUCTS}>
          <AdminProductForm />
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
  }
];
