
import { useState, useEffect } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { supabase } from "@/integrations/supabase/client";
import { PipelineSelector } from "./PipelineSelector";
import { KanbanColumn } from "./KanbanColumn";
import { ContactDrawer } from "./ContactDrawer";
import { Button } from "@/components/ui/button";
import { Plus, Filter, RefreshCw } from "lucide-react";

interface Contact {
  id: string;
  full_name: string;
  stage_id: string;
  whatsapp?: string;
  email?: string;
  city?: string;
  state?: string;
  cro?: string;
  last_interaction: string;
  responsible_id?: string;
  created_at: string;
  [key: string]: any; // Para campos adicionais
}

interface Stage {
  id: string;
  name: string;
  color: string;
  pipeline_id: string;
  order_index: number;
}

export const CRMKanban = () => {
  const [selectedPipeline, setSelectedPipeline] = useState<string | null>(null);
  const [stages, setStages] = useState<Stage[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (selectedPipeline) {
      fetchStages();
      fetchContacts();
    }
  }, [selectedPipeline]);

  const fetchStages = async () => {
    if (!selectedPipeline) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('crm_stages')
        .select('*')
        .eq('pipeline_id', selectedPipeline)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setStages(data || []);
    } catch (error) {
      console.error('Erro ao buscar estágios:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async () => {
    if (!selectedPipeline) return;
    
    try {
      // Primeiro buscamos os IDs dos estágios para este pipeline
      const { data: stageData, error: stageError } = await supabase
        .from('crm_stages')
        .select('id')
        .eq('pipeline_id', selectedPipeline);
        
      if (stageError) throw stageError;
      
      if (!stageData || stageData.length === 0) {
        setContacts([]);
        return;
      }
      
      const stageIds = stageData.map(stage => stage.id);
      
      // Depois buscamos os contatos que estão nesses estágios
      const { data, error } = await supabase
        .from('crm_contacts')
        .select('*')
        .in('stage_id', stageIds)
        .order('last_interaction', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Erro ao buscar contatos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { draggableId, destination, source } = result;

    // Se não houver destino ou o item for solto na mesma coluna e posição
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    // Atualizar o contato com o novo estágio
    try {
      const { error } = await supabase
        .from('crm_contacts')
        .update({
          stage_id: destination.droppableId,
          last_interaction: new Date().toISOString()
        })
        .eq('id', draggableId);

      if (error) throw error;
      
      // Atualizar o estado local para refletir a mudança
      const updatedContacts = contacts.map(contact => {
        if (contact.id === draggableId) {
          return { ...contact, stage_id: destination.droppableId };
        }
        return contact;
      });
      
      setContacts(updatedContacts);
      
      // Registrar a interação de mudança de estágio
      await supabase
        .from('crm_interactions')
        .insert({
          contact_id: draggableId,
          interaction_type: 'stage_change',
          content: `Contato movido para um novo estágio`,
          interaction_date: new Date().toISOString()
        });
        
    } catch (error) {
      console.error('Erro ao atualizar contato:', error);
    }
  };

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
    setDrawerOpen(true);
  };

  const handleCreateContact = () => {
    // Definir um contato novo com valores padrão
    // e o primeiro estágio do pipeline
    if (stages.length > 0) {
      const firstStage = stages.reduce((prev, current) => 
        prev.order_index < current.order_index ? prev : current);
      
      const newContact: Partial<Contact> = {
        stage_id: firstStage.id,
        full_name: "Novo Contato",
      };
      
      setSelectedContact(newContact as Contact);
      setDrawerOpen(true);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchContacts();
    setIsRefreshing(false);
  };

  const handleContactUpdated = () => {
    fetchContacts();
    setDrawerOpen(false);
    setSelectedContact(null);
  };

  if (loading && !selectedPipeline) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-gray-500">Carregando pipelines...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <PipelineSelector 
            selectedPipeline={selectedPipeline} 
            onPipelineChange={setSelectedPipeline} 
          />
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        <Button onClick={handleCreateContact}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Contato
        </Button>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 min-h-[70vh]">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-100 rounded-md animate-pulse h-[70vh]"></div>
          ))}
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 min-h-[70vh]">
            {stages.map((stage) => {
              const stageContacts = contacts.filter(
                contact => contact.stage_id === stage.id
              );
              
              return (
                <KanbanColumn
                  key={stage.id}
                  id={stage.id}
                  title={stage.name}
                  color={stage.color}
                  contacts={stageContacts}
                  onContactClick={handleContactClick}
                />
              );
            })}
          </div>
        </DragDropContext>
      )}
      
      <ContactDrawer
        contact={selectedContact}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onContactUpdated={handleContactUpdated}
        stages={stages}
      />
    </div>
  );
};

export default CRMKanban;
