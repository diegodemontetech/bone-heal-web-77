
import { useEffect } from "react";
import Layout from '@/components/admin/Layout';
import CRMKanban from '@/components/admin/kanban/CRMKanban';

const HuntingAtivoPage = () => {
  // Pipeline ID for Hunting Ativo
  const pipelineId = 'a1f15c3f-5c88-4a9a-b867-6107e160f045';

  useEffect(() => {
    document.title = "Hunting Ativo | CRM";
  }, []);

  return (
    <Layout>
      <CRMKanban defaultPipelineId={pipelineId} />
    </Layout>
  );
};

export default HuntingAtivoPage;
