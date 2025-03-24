
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Stage, Contact } from "@/types/crm";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { KanbanColumn } from "./KanbanColumn";
import { ContactDrawer } from "./ContactDrawer";
import { PipelineSelector } from "./PipelineSelector";
import { Loader2, PlusCircle } from "lucide-react";

export const CRMKanban = () => {
  const [stages, setStages] = useState<Stage[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedPipeline, setSelectedPipeline] = useState<string | null>(null);

  useEffect(() => {
    if (selectedPipeline) {
      fetchStages();
    }
  }, [selectedPipeline]);

  const fetchStages = async () => {
    try {
      setLoading(true);
      
      const { data: stagesData, error: stagesError } = await supabase
        .from("crm_stages")
        .select("*")
        .order("order_index", { ascending: true })
        .eq("pipeline_id", selectedPipeline);

      if (stagesError) throw stagesError;

      // Mapear os dados para o formato Stage
      const mappedStages: Stage[] = stagesData.map(stage => ({
        id: stage.id,
        name: stage.name,
        color: stage.color,
        pipeline_id: stage.pipeline_id || selectedPipeline,
        order_index: stage.order_index || stage.order || 0,
        created_at: stage.created_at,
        updated_at: stage.updated_at,
        department_id: stage.department_id
      }));

      setStages(mappedStages);
      
      if (mappedStages.length > 0) {
        fetchContacts(mappedStages);
      } else {
        setContacts([]);
        setLoading(false);
      }
    } catch (error) {
      console.error("Erro ao buscar estágios:", error);
      toast.error("Falha ao carregar estágios");
      setLoading(false);
    }
  };

  const fetchContacts = async (stagesList: Stage[]) => {
    try {
      const { data: contactsData, error: contactsError } = await supabase
        .from("crm_contacts")
        .select("*")
        .eq("pipeline_id", selectedPipeline);

      if (contactsError) throw contactsError;

      // Mapear os dados para o formato Contact
      const mappedContacts: Contact[] = contactsData.map(contact => ({
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
      console.error("Erro ao buscar contatos:", error);
      toast.error("Falha ao carregar contatos");
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStageId = destination.droppableId;

    try {
      // Atualizar no banco de dados
      const { error } = await supabase
        .from("crm_contacts")
        .update({ stage_id: newStageId })
        .eq("id", draggableId);

      if (error) throw error;

      // Registrar uma interação automática
      const { error: interactionError } = await supabase
        .from("crm_interactions")
        .insert({
          contact_id: draggableId,
          interaction_type: "note",
          content: `Contato movido para estágio ${stages.find(s => s.id === newStageId)?.name}`
        });

      if (interactionError) {
        console.error("Erro ao registrar interação:", interactionError);
      }

      // Atualizar o estado local
      setContacts(prevContacts => 
        prevContacts.map(contact => 
          contact.id === draggableId ? { ...contact, stage_id: newStageId } : contact
        )
      );

      toast.success("Contato movido com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar contato:", error);
      toast.error("Falha ao mover contato");
    }
  };

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
    setDrawerOpen(true);
  };

  const handleCreateNewContact = () => {
    if (!selectedPipeline || stages.length === 0) {
      toast.error("Selecione um pipeline com estágios definidos primeiro");
      return;
    }

    // Criar um novo contato vazio com o primeiro estágio definido
    const newContact: Contact = {
      id: "", // Será definido pelo backend
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

  const handleUpdateContacts = async () => {
    if (selectedPipeline) {
      await fetchStages();
    }
  };

  const contactsByStage = (stageId: string) => {
    return contacts.filter(contact => contact.stage_id === stageId);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <PipelineSelector 
            selectedPipeline={selectedPipeline} 
            onPipelineChange={setSelectedPipeline} 
          />
        </div>
        <Button onClick={handleCreateNewContact} disabled={!selectedPipeline || stages.length === 0}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Novo Contato
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Carregando...</span>
        </div>
      ) : !selectedPipeline ? (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Selecione um pipeline para visualizar os contatos
        </div>
      ) : stages.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Nenhum estágio encontrado neste pipeline. Cadastre estágios para começar.
        </div>
      ) : (
        <div className="flex-1 flex space-x-4 overflow-x-auto pb-4">
          {stages.map((stage) => (
            <KanbanColumn
              key={stage.id}
              stage={stage}
              contacts={contactsByStage(stage.id)}
              onContactClick={handleContactClick}
            />
          ))}
        </div>
      )}

      {selectedContact && (
        <ContactDrawer
          contact={selectedContact}
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
            setSelectedContact(null);
          }}
          onUpdate={handleUpdateContacts}
          stages={stages}
        />
      )}
    </div>
  );
};
