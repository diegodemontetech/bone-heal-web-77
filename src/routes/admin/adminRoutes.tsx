import { lazy, Suspense } from "react";
import { Navigate, Outlet, RouteObject } from "react-router-dom";
import { AdminRoute } from "./adminLoader";
import Layout from "@/components/admin/Layout";

// Admin pages - lazy loaded
const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Admin routes configuration
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
        <Suspense fallback={<PageLoader />}>
          <Dashboard />
        </Suspense>
      ),
    }
    // Other admin routes can be added here
  ],
};
