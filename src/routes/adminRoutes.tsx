
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { UserPermission } from "@/types/auth";

// Layout do Admin
const AdminLayout = lazy(() => import("@/components/admin/Layout"));

// Admin Pages
const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AdminUsers = lazy(() => import("@/pages/admin/Users"));
const AdminProducts = lazy(() => import("@/pages/admin/Products"));
const AdminOrders = lazy(() => import("@/pages/admin/Orders"));
const AdminVouchers = lazy(() => import("@/pages/admin/Vouchers"));
const AdminNews = lazy(() => import("@/pages/admin/News"));
const AdminStudies = lazy(() => import("@/pages/admin/Studies"));
const AdminLeads = lazy(() => import("@/pages/admin/Leads"));
const AdminWhatsapp = lazy(() => import("@/pages/admin/Whatsapp"));
const AdminEmailTemplates = lazy(() => import("@/pages/admin/EmailTemplates"));
const AdminShippingRates = lazy(() => import("@/pages/admin/ShippingRates"));
const AdminSync = lazy(() => import("@/pages/admin/Sync"));
const AdminSecurity = lazy(() => import("@/pages/admin/Security"));
const AdminTickets = lazy(() => import("@/pages/admin/Tickets"));
const AdminLogin = lazy(() => import("@/pages/AdminLogin"));

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
        {
          path: "dashboard",
          element: (
            <Suspense fallback={<AdminLoader />}>
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            </Suspense>
          )
        },
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
          path: "orders",
          element: (
            <Suspense fallback={<AdminLoader />}>
              <ProtectedRoute requiredPermission={UserPermission.MANAGE_ORDERS}>
                <AdminOrders />
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
        },
        {
          path: "news",
          element: (
            <Suspense fallback={<AdminLoader />}>
              <ProtectedRoute>
                <AdminNews />
              </ProtectedRoute>
            </Suspense>
          )
        },
        {
          path: "studies",
          element: (
            <Suspense fallback={<AdminLoader />}>
              <ProtectedRoute>
                <AdminStudies />
              </ProtectedRoute>
            </Suspense>
          )
        },
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
          path: "whatsapp",
          element: (
            <Suspense fallback={<AdminLoader />}>
              <ProtectedRoute>
                <AdminWhatsapp />
              </ProtectedRoute>
            </Suspense>
          )
        },
        {
          path: "email-templates",
          element: (
            <Suspense fallback={<AdminLoader />}>
              <ProtectedRoute>
                <AdminEmailTemplates />
              </ProtectedRoute>
            </Suspense>
          )
        },
        {
          path: "shipping-rates",
          element: (
            <Suspense fallback={<AdminLoader />}>
              <ProtectedRoute requiredPermission={UserPermission.MANAGE_SETTINGS}>
                <AdminShippingRates />
              </ProtectedRoute>
            </Suspense>
          )
        },
        {
          path: "sync",
          element: (
            <Suspense fallback={<AdminLoader />}>
              <ProtectedRoute requiredPermission={UserPermission.MANAGE_INTEGRATIONS}>
                <AdminSync />
              </ProtectedRoute>
            </Suspense>
          )
        },
        {
          path: "security",
          element: (
            <Suspense fallback={<AdminLoader />}>
              <ProtectedRoute requiredPermission={UserPermission.MANAGE_SETTINGS}>
                <AdminSecurity />
              </ProtectedRoute>
            </Suspense>
          )
        },
        {
          path: "tickets",
          element: (
            <Suspense fallback={<AdminLoader />}>
              <ProtectedRoute requiredPermission={UserPermission.MANAGE_SUPPORT}>
                <AdminTickets />
              </ProtectedRoute>
            </Suspense>
          )
        }
      ]
    }
  ]
};
