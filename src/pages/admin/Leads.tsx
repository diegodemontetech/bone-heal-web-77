
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Layout from '@/components/admin/Layout';
import LeadsFilters from "@/components/admin/leads/LeadsFilters";
import LeadsTable from "@/components/admin/leads/LeadsTable";
import LeadsLoading from "@/components/admin/leads/LeadsLoading";
import { useLeads } from "@/hooks/admin/useLeads";

const LeadsPage = () => {
  const {
    leads,
    isLoading,
    selectedStatus,
    setSelectedStatus,
    selectedSource,
    setSelectedSource,
    updateLeadStatus,
    convertToCRMContact
  } = useLeads();

  if (isLoading) {
    return (
      <Layout>
        <LeadsLoading />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Leads</CardTitle>
            <CardDescription>
              Gerencie contatos de potenciais clientes vindos do site e WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LeadsFilters
              selectedStatus={selectedStatus}
              selectedSource={selectedSource}
              onStatusChange={setSelectedStatus}
              onSourceChange={setSelectedSource}
            />

            <LeadsTable 
              leads={leads}
              onUpdateStatus={updateLeadStatus}
              onConvertToCRM={convertToCRMContact}
            />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default LeadsPage;
