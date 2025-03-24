
import { useEffect } from "react";
import Layout from '@/components/admin/Layout';
import CRMKanban from '@/components/admin/kanban/CRMKanban';

const CarteiraClientesPage = () => {
  // Pipeline ID for Carteira de Clientes
  const pipelineId = 'b2e27d4b-6d99-5b0a-c978-7218f271f156';
  
  useEffect(() => {
    document.title = "Carteira de Clientes | CRM";
  }, []);

  return (
    <Layout>
      <CRMKanban defaultPipelineId={pipelineId} />
    </Layout>
  );
};

export default CarteiraClientesPage;
