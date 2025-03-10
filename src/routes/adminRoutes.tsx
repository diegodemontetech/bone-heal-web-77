
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";

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

// Loader para componentes com lazy loading
const AdminLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export const adminRoutes: RouteObject = {
  path: "/admin",
  element: (
    <Suspense fallback={<AdminLoader />}>
      <AdminLayout />
    </Suspense>
  ),
  children: [
    {
      path: "dashboard",
      element: (
        <Suspense fallback={<AdminLoader />}>
          <Dashboard />
        </Suspense>
      )
    },
    {
      path: "users",
      element: (
        <Suspense fallback={<AdminLoader />}>
          <AdminUsers />
        </Suspense>
      )
    },
    {
      path: "products",
      element: (
        <Suspense fallback={<AdminLoader />}>
          <AdminProducts />
        </Suspense>
      )
    },
    {
      path: "orders",
      element: (
        <Suspense fallback={<AdminLoader />}>
          <AdminOrders />
        </Suspense>
      )
    },
    {
      path: "vouchers",
      element: (
        <Suspense fallback={<AdminLoader />}>
          <AdminVouchers />
        </Suspense>
      )
    },
    {
      path: "news",
      element: (
        <Suspense fallback={<AdminLoader />}>
          <AdminNews />
        </Suspense>
      )
    },
    {
      path: "studies",
      element: (
        <Suspense fallback={<AdminLoader />}>
          <AdminStudies />
        </Suspense>
      )
    },
    {
      path: "leads",
      element: (
        <Suspense fallback={<AdminLoader />}>
          <AdminLeads />
        </Suspense>
      )
    },
    {
      path: "whatsapp",
      element: (
        <Suspense fallback={<AdminLoader />}>
          <AdminWhatsapp />
        </Suspense>
      )
    },
    {
      path: "email-templates",
      element: (
        <Suspense fallback={<AdminLoader />}>
          <AdminEmailTemplates />
        </Suspense>
      )
    },
    {
      path: "shipping-rates",
      element: (
        <Suspense fallback={<AdminLoader />}>
          <AdminShippingRates />
        </Suspense>
      )
    },
    {
      path: "sync",
      element: (
        <Suspense fallback={<AdminLoader />}>
          <AdminSync />
        </Suspense>
      )
    },
    {
      path: "security",
      element: (
        <Suspense fallback={<AdminLoader />}>
          <AdminSecurity />
        </Suspense>
      )
    },
    {
      path: "tickets",
      element: (
        <Suspense fallback={<AdminLoader />}>
          <AdminTickets />
        </Suspense>
      )
    }
  ]
};
