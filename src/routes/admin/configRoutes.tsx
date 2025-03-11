
import { RouteObject } from "react-router-dom";
import Settings from "@/pages/admin/Settings";
import Shipping from "@/pages/admin/Shipping";
import ShippingRates from "@/pages/admin/ShippingRates";
import Vouchers from "@/pages/admin/Vouchers";
import CommercialConditions from "@/pages/admin/CommercialConditions";
import EmailTemplates from "@/pages/admin/EmailTemplates";
import Security from "@/pages/admin/Security";
import Sync from "@/pages/admin/Sync";
import ApiEvolution from "@/pages/admin/ApiEvolution";
import N8n from "@/pages/admin/N8n";

export const configRoutes: RouteObject[] = [
  {
    path: "settings",
    element: <Settings />
  },
  {
    path: "shipping",
    element: <Shipping />
  },
  {
    path: "shipping-rates",
    element: <ShippingRates />
  },
  {
    path: "vouchers",
    element: <Vouchers />
  },
  {
    path: "commercial-conditions",
    element: <CommercialConditions />
  },
  {
    path: "email-templates",
    element: <EmailTemplates />
  },
  {
    path: "security",
    element: <Security />
  },
  {
    path: "sync",
    element: <Sync />
  },
  {
    path: "api-evolution",
    element: <ApiEvolution />
  },
  {
    path: "n8n",
    element: <N8n />
  }
];
