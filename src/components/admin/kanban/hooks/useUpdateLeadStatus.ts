
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useUpdateLeadStatus = () => {
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
        return false;
      }
      
      return true;
    } catch (error: any) {
      console.error("Error:", error);
      toast("Erro ao atualizar status do lead", {
        description: "Ocorreu um erro ao tentar atualizar o status",
        duration: 3000,
        important: true,
      });
      return false;
    }
  };

  return { updateLeadStatus };
};
