
import { lazy, Suspense } from "react";
import { Navigate, Outlet, RouteObject } from "react-router-dom";
import { AdminRoute, AdminLoader } from "./admin/adminLoader";
import Layout from "@/components/admin/Layout";
import { productRoutes } from "./admin/productRoutes";
import { orderRoutes } from "./admin/orderRoutes";
import { userRoutes } from "./admin/userRoutes";
import { kanbanRoutes } from "./admin/kanbanRoutes";
import { marketingRoutes } from "./admin/marketingRoutes";
import { settingsRoutes } from "./admin/settingsRoutes";
import { supportRoutes } from "./admin/supportRoutes";

// Admin pages
const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));

// Todas as rotas são wrapped com o componente AdminRoute para proteger o acesso
export const adminRoutes: RouteObject = {
  path: "/admin",
  element: (
    <AdminRoute>
      <Layout />
    </AdminRoute>
  ),
  children: [
    {
      index: true,
      element: <Navigate to="/admin/dashboard" replace />,
    },
    {
      path: "dashboard",
      element: (
        <Suspense fallback={<AdminLoader />}>
          <Dashboard />
        </Suspense>
      ),
    },
    ...productRoutes,
    ...orderRoutes,
    ...userRoutes,
    ...kanbanRoutes,
    ...marketingRoutes,
    ...settingsRoutes,
    ...supportRoutes,
  ],
};
