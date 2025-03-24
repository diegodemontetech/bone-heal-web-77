
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Stage, Contact } from "@/types/crm";
import { toast } from "sonner";

export const useCRMData = (selectedPipeline: string | null) => {
  const [stages, setStages] = useState<Stage[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedPipeline) {
      fetchStages();
    } else {
      setStages([]);
      setContacts([]);
      setLoading(false);
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

      // Map to Stage type
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

      // Map to Contact type
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

  return {
    stages,
    contacts,
    loading,
    fetchStages
  };
};
