
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useLeadActions = () => {
  const updateMutation = useMutation({
    mutationFn: async ({ leadId, data }: { leadId: string, data: any }) => {
      try {
        const { error } = await supabase
          .from("crm_contacts")
          .update(data)
          .eq("id", leadId);

        if (error) throw error;
        
        return { success: true };
      } catch (error: any) {
        console.error("Erro ao atualizar lead:", error);
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success("Lead atualizado com sucesso");
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar lead: ${error.message}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (leadId: string) => {
      try {
        const { error } = await supabase
          .from("crm_contacts")
          .delete()
          .eq("id", leadId);

        if (error) throw error;
        
        return { success: true };
      } catch (error: any) {
        console.error("Erro ao excluir lead:", error);
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success("Lead excluído com sucesso");
    },
    onError: (error) => {
      toast.error(`Erro ao excluir lead: ${error.message}`);
    }
  });

  const updateLead = async (leadId: string, data: any) => {
    return updateMutation.mutateAsync({ leadId, data });
  };

  const deleteLead = async (leadId: string) => {
    return deleteMutation.mutateAsync(leadId);
  };

  return { 
    updateLead, 
    deleteLead,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};
