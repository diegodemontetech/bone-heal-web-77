
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useUpdateLeadStatus = () => {
  const mutation = useMutation({
    mutationFn: async ({ leadId, newStatus }: { leadId: string, newStatus: string }) => {
      try {
        const { error } = await supabase
          .from("contact_leads")
          .update({ status: newStatus })
          .eq("id", leadId);

        if (error) throw error;
        
        return { success: true };
      } catch (error: any) {
        console.error("Erro ao atualizar status:", error);
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success("Status atualizado com sucesso");
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar status: ${error.message}`);
    }
  });

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    return mutation.mutateAsync({ leadId, newStatus });
  };

  return { updateLeadStatus, isLoading: mutation.isPending };
};
