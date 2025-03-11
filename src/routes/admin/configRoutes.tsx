
import { RouteObject } from "react-router-dom";

import AdminSecurity from "@/pages/admin/Security";
import AdminShippingRates from "@/pages/admin/ShippingRates";
import AdminVouchers from "@/pages/admin/Vouchers";
import AdminCommercialConditions from "@/pages/admin/CommercialConditions";

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
  }
];
