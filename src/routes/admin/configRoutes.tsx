
import { RouteObject } from "react-router-dom";
import { lazy, Suspense } from "react";

import AdminSecurity from "@/pages/admin/Security";
import AdminShippingRates from "@/pages/admin/ShippingRates";
import AdminVouchers from "@/pages/admin/Vouchers";
import AdminCommercialConditions from "@/pages/admin/CommercialConditions";

// Placeholder para páginas que ainda não foram implementadas
const PlaceholderPage = lazy(() => import("@/pages/admin/PlaceholderPage"));

// Loader para componentes com lazy loading
const AdminLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export const configRoutes: RouteObject[] = [
  {
    path: "/admin/security",
    element: <AdminSecurity />
  },
  {
    path: "/admin/shipping",
    element: <AdminShippingRates />
  },
  {
    path: "/admin/shipping-rates",
    element: <AdminShippingRates />
  },
  {
    path: "/admin/vouchers",
    element: <AdminVouchers />
  },
  {
    path: "/admin/commercial-conditions",
    element: <AdminCommercialConditions />
  },
  {
    path: "/admin/email-templates",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <PlaceholderPage title="Templates de Email" />
      </Suspense>
    )
  },
  {
    path: "/admin/sync",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <PlaceholderPage title="Sincronização" />
      </Suspense>
    )
  },
  {
    path: "/admin/api-evolution",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <PlaceholderPage title="API Evolution" />
      </Suspense>
    )
  },
  {
    path: "/admin/n8n",
    element: (
      <Suspense fallback={<AdminLoader />}>
        <PlaceholderPage title="n8n" />
      </Suspense>
    )
  }
];
