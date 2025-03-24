
import { RouteObject } from "react-router-dom";
import AdminSettings from "@/pages/admin/Settings";
import AdminShipping from "@/pages/admin/Shipping";
import ShippingRates from "@/pages/admin/ShippingRates";
import AdminVouchers from "@/pages/admin/Vouchers";
import CommercialConditions from "@/pages/admin/CommercialConditions";
import ApiEvolution from "@/pages/admin/ApiEvolution";
import N8n from "@/pages/admin/N8n";
import AutomationFlows from "@/pages/admin/AutomationFlows";
import EmailTemplates from "@/pages/admin/EmailTemplates";
import Security from "@/pages/admin/Security";
import Sync from "@/pages/admin/Sync";

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
  },
  {
    path: "vouchers",
    element: <AdminVouchers />,
  },
  {
    path: "commercial-conditions",
    element: <CommercialConditions />,
  },
  {
    path: "email-templates",
    element: <EmailTemplates />,
  },
  {
    path: "security",
    element: <Security />,
  },
  {
    path: "sync",
    element: <Sync />,
  },
  {
    path: "api-evolution",
    element: <ApiEvolution />,
  },
  {
    path: "n8n",
    element: <N8n />,
  },
  {
    path: "automation/flows",
    element: <AutomationFlows />,
  }
];
