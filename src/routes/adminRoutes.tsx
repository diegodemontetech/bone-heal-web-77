
import { lazy, Suspense } from "react";
import { Navigate, Outlet, RouteObject } from "react-router-dom";
import { AdminRoute } from "./admin/adminLoader";
import Layout from "@/components/admin/Layout";
import { UserPermission } from "@/types/auth";
import { productRoutes } from "./admin/productRoutes";
import { orderRoutes } from "./admin/orderRoutes";
import { userRoutes } from "./admin/userRoutes";
import { kanbanRoutes } from "./admin/kanbanRoutes";
import { marketingRoutes } from "./admin/marketingRoutes";
import { settingsRoutes } from "./admin/settingsRoutes";
import { supportRoutes } from "./admin/supportRoutes";

// Admin pages
const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const Contacts = lazy(() => import("@/pages/admin/Contacts"));
const ContactDetails = lazy(() => import("@/pages/admin/ContactDetails"));

// Loader para componentes com lazy loading
const AdminLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

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
      element: (
        <Suspense fallback={<AdminLoader />}>
          <Dashboard />
        </Suspense>
      ),
    },
    {
      path: "contacts",
      element: (
        <Suspense fallback={<AdminLoader />}>
          <Contacts />
        </Suspense>
      ),
    },
    {
      path: "contacts/:id",
      element: (
        <Suspense fallback={<AdminLoader />}>
          <ContactDetails />
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
