
import { RouteObject } from "react-router-dom";
import AdminSettings from "@/pages/admin/Settings";
import AdminShipping from "@/pages/admin/Shipping";
import AdminShippingRates from "@/pages/admin/ShippingRates";
import AdminVouchers from "@/pages/admin/Vouchers";
import AdminCommercialConditions from "@/pages/admin/CommercialConditions";
import AdminEmailTemplates from "@/pages/admin/EmailTemplates";
import AdminSecurity from "@/pages/admin/Security";
import AdminSync from "@/pages/admin/Sync";
import AdminApiEvolution from "@/pages/admin/ApiEvolution";
import AdminN8n from "@/pages/admin/N8n";

export const configRoutes: RouteObject[] = [
  {
    path: "settings",
    element: <AdminSettings />
  },
  {
    path: "shipping",
    element: <AdminShipping />
  },
  {
    path: "shipping-rates",
    element: <AdminShippingRates />
  },
  {
    path: "vouchers",
    element: <AdminVouchers />
  },
  {
    path: "commercial-conditions",
    element: <AdminCommercialConditions />
  },
  {
    path: "email-templates",
    element: <AdminEmailTemplates />
  },
  {
    path: "security",
    element: <AdminSecurity />
  },
  {
    path: "sync",
    element: <AdminSync />
  },
  {
    path: "api-evolution",
    element: <AdminApiEvolution />
  },
  {
    path: "n8n",
    element: <AdminN8n />
  }
];
