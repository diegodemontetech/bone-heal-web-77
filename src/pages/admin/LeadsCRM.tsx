
import { useState, useEffect } from 'react';
import { CRMKanban } from '@/components/admin/crm/CRMKanban';
import { CRMList } from '@/components/admin/crm/CRMList';
import Layout from '@/components/admin/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Filter, Plus } from 'lucide-react';
import { ContactDrawer } from '@/components/admin/crm/ContactDrawer';
import { Contact, Stage } from '@/types/crm';
import { PipelineSelector } from '@/components/admin/crm/PipelineSelector';
import { supabase } from '@/integrations/supabase/client';

const LeadsCRM = () => {
  const [activeTab, setActiveTab] = useState("kanban");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedPipeline, setSelectedPipeline] = useState<string | null>(null);
  const [stages, setStages] = useState<Stage[]>([]);
  
  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
    setDrawerOpen(true);
  };
  
  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedContact(null);
  };

  // Fetch stages whenever pipeline changes
  useEffect(() => {
    if (selectedPipeline) {
      fetchStages();
    }
  }, [selectedPipeline]);

  const fetchStages = async () => {
    try {
      const { data, error } = await supabase
        .from("crm_stages")
        .select("*")
        .eq("pipeline_id", selectedPipeline)
        .order("order_index", { ascending: true });

      if (error) throw error;

      // Map to Stage type
      const mappedStages: Stage[] = data.map(stage => ({
        id: stage.id,
        name: stage.name,
        color: stage.color,
        pipeline_id: stage.pipeline_id,
        order_index: stage.order_index || 0,
        created_at: stage.created_at,
        updated_at: stage.updated_at
      }));

      setStages(mappedStages);
    } catch (error) {
      console.error("Erro ao buscar estágios:", error);
    }
  };

  const handleCreateNewContact = () => {
    if (!selectedPipeline || stages.length === 0) return;

    // Create a new empty contact with the first stage defined
    const newContact: Contact = {
      id: "", // Will be set by backend
      full_name: "",
      stage_id: stages[0].id,
      pipeline_id: selectedPipeline,
      last_interaction: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setSelectedContact(newContact);
    setDrawerOpen(true);
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestão de Leads</h1>
          
          <div className="flex items-center gap-2">
            <PipelineSelector
              selectedPipeline={selectedPipeline}
              onPipelineChange={setSelectedPipeline}
            />
            
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
            
            <Button size="sm" onClick={handleCreateNewContact} disabled={!selectedPipeline || stages.length === 0}>
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
            <CRMKanban />
          </TabsContent>
          
          <TabsContent value="list" className="mt-0">
            {selectedPipeline ? (
              <CRMList 
                pipelineId={selectedPipeline} 
                onContactClick={handleContactSelect} 
              />
            ) : (
              <div className="text-center p-8">
                <p className="text-muted-foreground">Selecione um pipeline para visualizar os contatos</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {selectedContact && (
          <ContactDrawer 
            open={drawerOpen}
            onClose={closeDrawer}
            contact={selectedContact}
            onUpdate={async () => {
              if (activeTab === "list") {
                // Refetch contacts for list view
                const { data } = await supabase
                  .from("crm_contacts")
                  .select("*")
                  .eq("pipeline_id", selectedPipeline);
              }
            }}
            stages={stages}
          />
        )}
      </div>
    </Layout>
  );
};

export default LeadsCRM;
