
import { CRMKanban } from '@/components/admin/crm/CRMKanban';
import Layout from '@/components/admin/Layout';

const LeadsKanbanPage = () => {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Kanban de Leads</h1>
        <CRMKanban />
      </div>
    </Layout>
  );
};

export default LeadsKanbanPage;
