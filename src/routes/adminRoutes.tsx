
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Layout do Admin
const AdminLayout = lazy(() => import("@/components/admin/Layout"));
const AdminLogin = lazy(() => import("@/pages/AdminLogin"));

// Importar rotas por categoria
import { dashboardRoutes } from "./admin/dashboardRoutes";
import { userRoutes } from "./admin/userRoutes";
import { productRoutes } from "./admin/productRoutes";
import { orderRoutes } from "./admin/orderRoutes";
import { contentRoutes } from "./admin/contentRoutes";
import { crmRoutes } from "./admin/crmRoutes";
import { configRoutes } from "./admin/configRoutes";
import { supportRoutes } from "./admin/supportRoutes";

// Loader para componentes com lazy loading
const AdminLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export const adminRoutes: RouteObject = {
  path: "/admin",
  children: [
    {
      path: "login",
      element: (
        <Suspense fallback={<AdminLoader />}>
          <AdminLogin />
        </Suspense>
      ),
    },
    {
      element: (
        <Suspense fallback={<AdminLoader />}>
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        </Suspense>
      ),
      children: [
        ...dashboardRoutes,
        ...userRoutes,
        ...productRoutes,
        ...orderRoutes,
        ...contentRoutes,
        ...crmRoutes,
        ...configRoutes,
        ...supportRoutes
      ]
    }
  ]
};
