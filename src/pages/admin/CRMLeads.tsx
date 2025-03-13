
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import LeadsKanban from "@/components/admin/kanban/LeadsKanban";

const CRMLeads = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <LeadsKanban />
    </Suspense>
  );
};

export default CRMLeads;
