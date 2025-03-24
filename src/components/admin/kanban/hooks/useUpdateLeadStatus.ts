
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useUpdateLeadStatus = () => {
  const updateLeadStatus = async (leadId: string, newStageId: string) => {
    try {
      const { error } = await supabase
        .from("crm_contacts")
        .update({ stage_id: newStageId })
        .eq("id", leadId);

      if (error) {
        console.error("Error updating lead status:", error);
        toast("Erro ao atualizar estágio do lead", {
          description: error.message,
          duration: 3000,
          important: true,
        });
        return false;
      }
      
      return true;
    } catch (error: any) {
      console.error("Error:", error);
      toast("Erro ao atualizar estágio do lead", {
        description: "Ocorreu um erro ao tentar atualizar o estágio",
        duration: 3000,
        important: true,
      });
      return false;
    }
  };

  return { updateLeadStatus };
};
