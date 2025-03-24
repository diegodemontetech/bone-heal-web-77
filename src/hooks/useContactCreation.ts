
import { useState } from "react";
import { Contact, Stage } from "@/types/crm";
import { toast } from "sonner";

export const useContactCreation = (
  selectedPipeline: string | null,
  stages: Stage[]
) => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
    setDrawerOpen(true);
  };

  const handleCreateNewContact = () => {
    if (!selectedPipeline || stages.length === 0) {
      toast.error("Selecione um pipeline com estágios definidos primeiro");
      return;
    }

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

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedContact(null);
  };

  return {
    selectedContact,
    drawerOpen,
    handleContactClick,
    handleCreateNewContact,
    handleCloseDrawer
  };
};
