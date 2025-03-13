
import { RouteObject } from "react-router-dom";
import CRMLeads from "@/pages/admin/CRMLeads";
import CreateLead from "@/pages/admin/CreateLead";
import LeadsKanban from "@/pages/admin/LeadsKanban";
import CRMConfigPage from "@/components/admin/crm/config/CRMConfigPage";
import AutomationFlowsPage from "@/pages/admin/AutomationFlows";
import CRMPipelines from "@/pages/admin/CRMPipelines";
import PipelineConfig from "@/pages/admin/PipelineConfig";

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
  },
  {
    path: "pipelines",
    element: <CRMPipelines />
  },
  {
    path: "pipelines/:id/configurar",
    element: <PipelineConfig />
  }
];
