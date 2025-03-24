
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Lead } from "@/types/leads";
import { useNavigate } from "react-router-dom";

export const useLeads = () => {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const navigate = useNavigate();

  const { data: leads, isLoading, refetch } = useQuery({
    queryKey: ["leads", selectedStatus, selectedSource],
    queryFn: async () => {
      let query = supabase
        .from("contact_leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (selectedStatus && selectedStatus !== "all") {
        query = query.eq("status", selectedStatus);
      }
      
      if (selectedSource && selectedSource !== "all") {
        query = query.eq("source", selectedSource);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching leads:", error);
        throw error;
      }
      
      return data as Lead[];
    },
  });

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("contact_leads")
        .update({ status: newStatus })
        .eq("id", leadId);

      if (error) {
        console.error("Error updating lead status:", error);
        toast("Erro ao atualizar status do lead", {
          description: error.message,
          duration: 3000,
          important: true,
        });
      } else {
        toast.success("Status do lead atualizado com sucesso");
        refetch();
      }
    } catch (error) {
      console.error("Error:", error);
      toast("Erro ao atualizar status do lead", {
        description: "Ocorreu um erro ao tentar atualizar o status",
        duration: 3000,
        important: true,
      });
    }
  };

  const convertToCRMContact = async (lead: Lead) => {
    try {
      // Get the first stage ID of the Hunting pipeline
      const { data: stageData } = await supabase
        .from('crm_stages')
        .select('id')
        .eq('pipeline_id', 'a1f15c3f-5c88-4a9a-b867-6107e160f045') // Hunting Ativo pipeline ID
        .order('order_index', { ascending: true })
        .limit(1);
      
      if (stageData && stageData.length > 0) {
        const stageId = stageData[0].id;
        
        // Create CRM contact
        const { data, error } = await supabase.from('crm_contacts').insert({
          full_name: lead.name,
          whatsapp: lead.phone,
          email: lead.email || null,
          pipeline_id: 'a1f15c3f-5c88-4a9a-b867-6107e160f045', // Hunting Ativo pipeline ID
          stage_id: stageId,
          observations: `Convertido de lead. Fonte: ${lead.source === 'whatsapp_widget' ? 'WhatsApp' : 'Formulário de Contato'}. Motivo: ${lead.reason}. Mensagem: ${lead.message || ''}`,
          client_type: 'Lead'
        }).select();
        
        if (error) {
          throw error;
        }
        
        // Mark lead as contacted
        await updateLeadStatus(lead.id, 'contacted');
        
        toast.success("Lead convertido para CRM com sucesso");
        
        // Navigate to CRM with the new contact
        if (data && data.length > 0) {
          navigate('/admin/crm/hunting');
        }
      }
    } catch (error) {
      console.error('Error converting lead to CRM contact:', error);
      toast.error("Erro ao converter lead para CRM");
    }
  };

  return {
    leads,
    isLoading,
    selectedStatus,
    setSelectedStatus,
    selectedSource,
    setSelectedSource,
    updateLeadStatus,
    convertToCRMContact,
    navigate
  };
};
