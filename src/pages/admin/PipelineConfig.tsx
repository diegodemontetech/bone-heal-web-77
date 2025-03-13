
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import PipelineConfigPage from "@/components/admin/crm/pipelines/PipelineConfigPage";

const PipelineConfig = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <PipelineConfigPage />
    </Suspense>
  );
};

export default PipelineConfig;
