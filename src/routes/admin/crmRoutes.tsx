
import { RouteObject } from "react-router-dom";
import CRMLeads from "@/pages/admin/CRMLeads";
import CreateLead from "@/pages/admin/CreateLead";
import LeadsKanban from "@/pages/admin/LeadsKanban";
import CRMConfigPage from "@/components/admin/crm/config/CRMConfigPage";
import AutomationFlowsPage from "@/pages/admin/AutomationFlows";

export const crmRoutes: RouteObject[] = [
  {
    path: "crm-leads",
    element: <CRMLeads />
  },
  {
    path: "criar-lead",
    element: <CreateLead />
  },
  {
    path: "leads-kanban",
    element: <LeadsKanban />
  },
  {
    path: "configuracoes",
    element: <CRMConfigPage />
  },
  {
    path: "automacoes",
    element: <AutomationFlowsPage />
  },
  {
    path: "automation-flows/:flowId",
    element: <AutomationFlowsPage />
  }
];
