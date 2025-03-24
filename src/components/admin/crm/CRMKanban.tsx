
import { useState } from "react";
import { Contact } from "@/types/crm";
import { KanbanColumn } from "./KanbanColumn";
import { ContactDrawer } from "./ContactDrawer";
import { DragDropContext } from "@hello-pangea/dnd";
import { useCRMData } from "@/hooks/useCRMData";
import { useContactDragDrop } from "@/hooks/useContactDragDrop";
import { useContactCreation } from "@/hooks/useContactCreation";
import { CRMKanbanToolbar } from "./CRMKanbanToolbar";
import { LoadingState, EmptyState } from "./CRMKanbanStates";

export const CRMKanban = () => {
  const [selectedPipeline, setSelectedPipeline] = useState<string | null>(null);
  
  // Use custom hooks to manage data and operations
  const { stages, contacts, loading, fetchStages } = useCRMData(selectedPipeline);
  
  // Handle updating contacts after drag and drop
  const handleContactsUpdate = (updatedContacts: Contact[]) => {
    // Since we're using the useCRMData hook which manages its own state,
    // we need to refresh the data from the server after an update
    fetchStages();
  };
  
  const { handleDragEnd } = useContactDragDrop(contacts, stages, handleContactsUpdate);
  
  const { 
    selectedContact, 
    drawerOpen, 
    handleContactClick,
    handleCreateNewContact, 
    handleCloseDrawer 
  } = useContactCreation(selectedPipeline, stages);

  // Helper function to filter contacts by stage
  const contactsByStage = (stageId: string) => {
    return contacts.filter(contact => contact.stage_id === stageId);
  };

  return (
    <div className="h-full flex flex-col">
      <CRMKanbanToolbar
        selectedPipeline={selectedPipeline}
        onPipelineChange={setSelectedPipeline}
        onCreateContact={handleCreateNewContact}
        disabled={!selectedPipeline || stages.length === 0}
      />

      {loading ? (
        <LoadingState />
      ) : !selectedPipeline ? (
        <EmptyState message="Selecione um pipeline para visualizar os contatos" />
      ) : stages.length === 0 ? (
        <EmptyState message="Nenhum estágio encontrado neste pipeline. Cadastre estágios para começar." />
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
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
        </DragDropContext>
      )}

      {selectedContact && (
        <ContactDrawer
          contact={selectedContact}
          open={drawerOpen}
          onClose={handleCloseDrawer}
          onUpdate={fetchStages}
          stages={stages}
        />
      )}
    </div>
  );
};
