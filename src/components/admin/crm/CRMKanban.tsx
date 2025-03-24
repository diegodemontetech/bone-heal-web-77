
import { useState, useEffect } from "react";
import { DragDropContext, DropResult, Draggable, Droppable } from "@hello-pangea/dnd";
import { supabase } from "@/integrations/supabase/client";
import { KanbanColumn } from "./KanbanColumn";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ContactDrawer } from "./ContactDrawer";

interface Stage {
  id: string;
  name: string;
  color: string;
  pipeline_id: string;
  order_index: number;
}

interface Contact {
  id: string;
  full_name: string;
  stage_id: string;
  cro?: string;
  city?: string;
  state?: string;
  last_interaction: string;
  responsible_id?: string;
  [key: string]: any;
}

interface CRMKanbanProps {
  pipelineId: string | null;
  refreshTrigger?: number;
}

const CRMKanban = ({ pipelineId, refreshTrigger = 0 }: CRMKanbanProps) => {
  const [stages, setStages] = useState<Stage[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (pipelineId) {
      fetchStages();
      fetchContacts();
    } else {
      fetchDefaultPipeline();
    }
  }, [pipelineId, refreshTrigger]);

  const fetchDefaultPipeline = async () => {
    setLoading(true);
    try {
      // Buscar o primeiro pipeline disponível
      const { data: pipelines, error } = await supabase
        .from('crm_pipelines')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })
        .limit(1);

      if (error) throw error;
      
      if (pipelines && pipelines.length > 0) {
        // Usar o primeiro pipeline como padrão
        const defaultPipeline = pipelines[0];
        
        // Buscar estágios deste pipeline
        const { data: stagesData, error: stagesError } = await supabase
          .from('crm_stages')
          .select('*')
          .eq('pipeline_id', defaultPipeline.id)
          .order('order_index', { ascending: true });

        if (stagesError) throw stagesError;
        
        setStages(stagesData || []);
        
        // Buscar contatos para este pipeline
        if (stagesData && stagesData.length > 0) {
          const stageIds = stagesData.map(stage => stage.id);
          
          const { data: contactsData, error: contactsError } = await supabase
            .from('leads')
            .select('*')
            .in('stage_id', stageIds);

          if (contactsError) throw contactsError;
          
          setContacts(contactsData || []);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar pipeline padrão:', error);
      toast.error('Erro ao carregar dados do CRM');
    } finally {
      setLoading(false);
    }
  };

  const fetchStages = async () => {
    if (!pipelineId) return;
    
    try {
      const { data, error } = await supabase
        .from('crm_stages')
        .select('*')
        .eq('pipeline_id', pipelineId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      
      setStages(data || []);
    } catch (error) {
      console.error('Erro ao buscar estágios:', error);
      toast.error('Erro ao carregar estágios');
    }
  };

  const fetchContacts = async () => {
    if (!pipelineId) return;
    
    try {
      // Primeiro buscar os estágios do pipeline
      const { data: stagesData, error: stagesError } = await supabase
        .from('crm_stages')
        .select('id')
        .eq('pipeline_id', pipelineId);

      if (stagesError) throw stagesError;
      
      if (stagesData && stagesData.length > 0) {
        const stageIds = stagesData.map(stage => stage.id);
        
        // Buscar contatos desses estágios
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .in('stage_id', stageIds);

        if (error) throw error;
        
        setContacts(data || []);
      } else {
        setContacts([]);
      }
    } catch (error) {
      console.error('Erro ao buscar contatos:', error);
      toast.error('Erro ao carregar contatos');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Se não houver destino ou o destino for o mesmo que a origem, não fazer nada
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    // Atualizar localmente para feedback imediato
    const newContacts = [...contacts];
    const movedContact = newContacts.find(contact => contact.id === draggableId);
    
    if (movedContact) {
      // Atualizar o stage_id do contato
      movedContact.stage_id = destination.droppableId;
      setContacts(newContacts);
      
      try {
        // Registrar interação de mudança de estágio
        const sourceStage = stages.find(stage => stage.id === source.droppableId);
        const destStage = stages.find(stage => stage.id === destination.droppableId);
        
        // Atualizar no banco de dados
        const { error } = await supabase
          .from('leads')
          .update({ stage_id: destination.droppableId, last_interaction: new Date().toISOString() })
          .eq('id', draggableId);

        if (error) throw error;
        
        // Registrar a mudança como uma interação
        await supabase.from('crm_interactions').insert({
          contact_id: draggableId,
          interaction_type: 'stage_change',
          content: `Movido de "${sourceStage?.name || 'Estágio anterior'}" para "${destStage?.name || 'Novo estágio'}"`,
          interaction_date: new Date().toISOString()
        });
        
        toast.success('Contato movido com sucesso!');
      } catch (error) {
        console.error('Erro ao mover contato:', error);
        toast.error('Erro ao mover contato');
        
        // Reverter a mudança local em caso de erro
        fetchContacts();
      }
    }
  };

  const getContactsByStage = (stageId: string) => {
    return contacts.filter(contact => contact.stage_id === stageId);
  };

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDrawerOpen(true);
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (stages.length === 0) {
    return (
      <div className="h-[70vh] flex items-center justify-center bg-muted/30 rounded-lg border border-dashed">
        <div className="text-center p-8">
          <h3 className="text-lg font-medium mb-2">Nenhum estágio encontrado</h3>
          <p className="text-muted-foreground mb-4">
            Selecione um pipeline ou verifique se há estágios configurados.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex space-x-4 overflow-x-auto pb-4 min-h-[70vh]">
          {stages.map((stage) => (
            <KanbanColumn
              key={stage.id}
              id={stage.id}
              title={stage.name}
              color={stage.color}
              contacts={getContactsByStage(stage.id)}
              onContactClick={handleContactClick}
            />
          ))}
        </div>
      </DragDropContext>

      <ContactDrawer
        contact={selectedContact}
        open={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedContact(null);
        }}
        onUpdate={() => fetchContacts()}
        stages={stages}
      />
    </div>
  );
};

export default CRMKanban;
