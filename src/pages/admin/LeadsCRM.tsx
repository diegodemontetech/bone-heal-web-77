
import { useState } from 'react';
import { CRMKanban } from '@/components/admin/crm/CRMKanban';
import Layout from '@/components/admin/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Filter, Plus } from 'lucide-react';
import ContactDrawer from '@/components/admin/crm/ContactDrawer';

const LeadsCRM = () => {
  const [activeTab, setActiveTab] = useState("kanban");
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const handleContactSelect = (contact: any) => {
    setSelectedContact(contact);
    setDrawerOpen(true);
  };
  
  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedContact(null);
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestão de Leads</h1>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Todos os leads</DropdownMenuItem>
                <DropdownMenuItem>Leads ativos</DropdownMenuItem>
                <DropdownMenuItem>Leads inativos</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Novo Lead
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
            <TabsTrigger value="list">Lista</TabsTrigger>
          </TabsList>
          
          <TabsContent value="kanban" className="mt-0">
            <CRMKanban onContactSelect={handleContactSelect} />
          </TabsContent>
          
          <TabsContent value="list" className="mt-0">
            <div className="text-center p-8">
              <p className="text-muted-foreground">Visualização em lista em desenvolvimento</p>
            </div>
          </TabsContent>
        </Tabs>
        
        <ContactDrawer 
          open={drawerOpen}
          onClose={closeDrawer}
          contactId={selectedContact?.id}
        />
      </div>
    </Layout>
  );
};

export default LeadsCRM;
