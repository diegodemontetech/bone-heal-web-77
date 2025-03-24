
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { UserPermission } from "@/types/auth";

const ShippingRatesPage = lazy(() => import("@/pages/admin/ShippingRates"));
const ShippingPage = lazy(() => import("@/pages/admin/Shipping"));

const AdminLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export const shippingRoutes: RouteObject[] = [
  {
    path: "shipping",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <ProtectedRoute requiredPermission={UserPermission.MANAGE_SETTINGS}>
          <ShippingPage />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: "shipping/rates",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <ProtectedRoute requiredPermission={UserPermission.MANAGE_SETTINGS}>
          <ShippingRatesPage />
        </ProtectedRoute>
      </Suspense>
    ),
  }
];
