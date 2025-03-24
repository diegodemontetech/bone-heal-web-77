
import { RouteObject } from "react-router-dom";
import AdminSettings from "@/pages/admin/Settings";
import AdminShipping from "@/pages/admin/Shipping";
import ShippingRates from "@/pages/admin/ShippingRates";

export const configRoutes: RouteObject[] = [
  {
    path: "settings",
    element: <AdminSettings />,
  },
  {
    path: "shipping",
    element: <AdminShipping />,
  },
  {
    path: "shipping-rates",
    element: <ShippingRates />,
  }
];
