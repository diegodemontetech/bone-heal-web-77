
import { DropResult } from "@hello-pangea/dnd";
import { supabase } from "@/integrations/supabase/client";
import { Contact, Stage } from "@/types/crm";
import { toast } from "sonner";

export const useContactDragDrop = (
  contacts: Contact[],
  stages: Stage[],
  onContactsUpdate: (updatedContacts: Contact[]) => void
) => {
  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStageId = destination.droppableId;

    try {
      // Update in database
      const { error } = await supabase
        .from("crm_contacts")
        .update({ stage_id: newStageId })
        .eq("id", draggableId);

      if (error) throw error;

      // Record an automatic interaction
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

      // Update local state
      const updatedContacts = contacts.map(contact => 
        contact.id === draggableId ? { ...contact, stage_id: newStageId } : contact
      );
      
      onContactsUpdate(updatedContacts);
      toast.success("Contato movido com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar contato:", error);
      toast.error("Falha ao mover contato");
    }
  };

  return { handleDragEnd };
};
