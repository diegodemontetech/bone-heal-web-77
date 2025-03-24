
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Stage, Contact } from "@/types/crm";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { KanbanColumn } from "./KanbanColumn";
import { ContactDrawer } from "./ContactDrawer";
import { toast } from "sonner";

interface CRMKanbanProps {
  pipelineId: string | null;
  refreshTrigger: number;
}

const CRMKanban = ({ pipelineId, refreshTrigger }: CRMKanbanProps) => {
  const [stages, setStages] = useState<Stage[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  useEffect(() => {
    if (pipelineId) {
      fetchStagesAndContacts();
    } else {
      setIsLoading(false);
      setStages([]);
      setContacts([]);
    }
  }, [pipelineId, refreshTrigger]);
  
  const fetchStagesAndContacts = async () => {
    if (!pipelineId) return;
    
    setIsLoading(true);
    try {
      // Buscar estágios
      const { data: stagesData, error: stagesError } = await supabase
        .from("crm_stages")
        .select("*")
        .eq("pipeline_id", pipelineId)
        .order("order_index", { ascending: true });
        
      if (stagesError) throw stagesError;
      
      // Mapear dados para o formato Stage
      const mappedStages: Stage[] = (stagesData || []).map(stage => ({
        id: stage.id,
        name: stage.name,
        color: stage.color,
        pipeline_id: stage.pipeline_id || pipelineId,
        order_index: stage.order_index || stage.order || 0,
        department_id: stage.department_id,
        created_at: stage.created_at,
        updated_at: stage.updated_at
      }));
      
      setStages(mappedStages);
      
      // Buscar contatos
      const { data: contactsData, error: contactsError } = await supabase
        .from("crm_contacts")
        .select("*")
        .eq("pipeline_id", pipelineId);
        
      if (contactsError) throw contactsError;
      
      // Mapear dados para o formato Contact
      const mappedContacts: Contact[] = (contactsData || []).map(contact => ({
        id: contact.id,
        full_name: contact.full_name,
        stage_id: contact.stage_id,
        pipeline_id: contact.pipeline_id,
        cro: contact.cro,
        cpf_cnpj: contact.cpf_cnpj,
        specialty: contact.specialty,
        whatsapp: contact.whatsapp,
        email: contact.email,
        address: contact.address,
        city: contact.city,
        state: contact.state,
        clinic_name: contact.clinic_name,
        client_type: contact.client_type,
        responsible_id: contact.responsible_id,
        next_interaction_date: contact.next_interaction_date,
        observations: contact.observations,
        next_steps: contact.next_steps,
        last_interaction: contact.last_interaction,
        created_at: contact.created_at,
        updated_at: contact.updated_at
      }));
      
      setContacts(mappedContacts);
    } catch (error) {
      console.error("Erro ao buscar dados do CRM:", error);
      toast.error("Erro ao carregar dados");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleContactDrop = async (contactId: string, newStageId: string) => {
    const updatedContact = contacts.find(c => c.id === contactId);
    if (!updatedContact) return;
    
    try {
      // Atualizar contato no banco de dados
      const { error } = await supabase
        .from("crm_contacts")
        .update({ stage_id: newStageId })
        .eq("id", contactId);
        
      if (error) throw error;
      
      // Atualizar contatos localmente
      setContacts(prev => 
        prev.map(contact => 
          contact.id === contactId 
            ? { ...contact, stage_id: newStageId } 
            : contact
        )
      );
      
      // Registrar interação
      await supabase
        .from("crm_interactions")
        .insert({
          contact_id: contactId,
          interaction_type: "status_change",
          content: `Contato movido para ${stages.find(s => s.id === newStageId)?.name || "outro estágio"}`,
          interaction_date: new Date().toISOString()
        });
        
    } catch (error) {
      console.error("Erro ao atualizar contato:", error);
      toast.error("Erro ao mover contato");
    }
  };
  
  const handleCreateContact = async () => {
    if (!pipelineId || stages.length === 0) {
      toast.error("Selecione um pipeline com estágios primeiro");
      return;
    }
    
    try {
      const firstStage = stages[0];
      
      // Criar novo contato
      const { data, error } = await supabase
        .from("crm_contacts")
        .insert({
          full_name: "Novo Contato",
          stage_id: firstStage.id,
          pipeline_id: pipelineId,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Adicionar contato à lista
      const newContact: Contact = {
        ...data,
        id: data.id,
        full_name: data.full_name || "Novo Contato",
        stage_id: data.stage_id
      };
      
      setContacts(prev => [...prev, newContact]);
      
      // Abrir drawer para edição
      setSelectedContact(newContact);
      setIsDrawerOpen(true);
      
    } catch (error) {
      console.error("Erro ao criar contato:", error);
      toast.error("Erro ao criar contato");
    }
  };
  
  const handleContactUpdate = async () => {
    await fetchStagesAndContacts();
  };
  
  const openContactDrawer = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDrawerOpen(true);
  };
  
  const closeContactDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedContact(null);
  };

  return (
    <div className="space-y-4">
      {!pipelineId ? (
        <div className="text-center p-8 border rounded-lg bg-muted/40">
          <h3 className="text-lg font-medium mb-2">Selecione um Pipeline</h3>
          <p className="text-muted-foreground mb-4">
            Escolha um pipeline para visualizar o quadro Kanban
          </p>
        </div>
      ) : isLoading ? (
        <div className="text-center p-8 border rounded-lg">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      ) : stages.length === 0 ? (
        <div className="text-center p-8 border rounded-lg bg-muted/40">
          <h3 className="text-lg font-medium mb-2">Nenhum estágio encontrado</h3>
          <p className="text-muted-foreground mb-4">
            Este pipeline não tem estágios configurados
          </p>
          <Button variant="secondary" onClick={fetchStagesAndContacts}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <Button onClick={handleCreateContact}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Contato
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-x-auto p-1">
            {stages.map((stage) => (
              <KanbanColumn
                key={stage.id}
                stage={stage}
                contacts={contacts.filter(contact => contact.stage_id === stage.id)}
                onContactClick={openContactDrawer}
                onContactDrop={handleContactDrop}
              />
            ))}
          </div>
        </>
      )}
      
      {selectedContact && (
        <ContactDrawer
          contact={selectedContact}
          open={isDrawerOpen}
          onClose={closeContactDrawer}
          onUpdate={handleContactUpdate}
          stages={stages}
        />
      )}
    </div>
  );
};

export default CRMKanban;
