
import { Route } from "react-router-dom";
import WhatsAppMessages from "@/pages/admin/WhatsAppMessages";
import WhatsAppSettings from "@/pages/admin/WhatsAppSettings";
import AutomationFlows from "@/pages/admin/AutomationFlows";

export const whatsappRoutes = [
  {
    path: "whatsapp/messages",
    element: <WhatsAppMessages />
  },
  {
    path: "whatsapp/settings",
    element: <WhatsAppSettings />
  },
  {
    path: "automation/flows",
    element: <AutomationFlows />
  }
];
