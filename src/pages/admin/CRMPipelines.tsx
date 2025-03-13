
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import CRMPipelinesPage from "@/components/admin/crm/pipelines/CRMPipelinesPage";

const CRMPipelines = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <CRMPipelinesPage />
    </Suspense>
  );
};

export default CRMPipelines;
