
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook for syncing customers with Omie
 */
export const useCustomerSync = () => {
  /**
   * Sincroniza um cliente com o Omie caso ainda não esteja sincronizado
   */
  const syncCustomerWithOmie = async (userId: string) => {
    try {
      // Verificar se o cliente já está sincronizado
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("omie_code, omie_sync")
        .eq("id", userId)
        .single();

      if (profileError) {
        console.error("Erro ao verificar perfil de cliente:", profileError);
        throw profileError;
      }

      // Se já estiver sincronizado, não faz nada
      if (profile.omie_code && profile.omie_sync) {
        console.log(`Cliente ${userId} já está sincronizado com Omie. Código: ${profile.omie_code}`);
        return { success: true, already_synced: true };
      }

      // Sincronizar cliente com Omie
      const { data: omieData, error: omieError } = await supabase.functions.invoke('omie-customer', {
        body: { user_id: userId }
      });

      if (omieError) {
        console.error("Erro ao sincronizar cliente com Omie:", omieError);
        throw omieError;
      }

      // Se a sincronização foi bem-sucedida, atualizar o perfil
      if (omieData?.success && omieData?.omie_code) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            omie_code: omieData.omie_code,
            omie_sync: true,
            updated_at: new Date().toISOString()
          })
          .eq("id", userId);

        if (updateError) {
          console.error("Erro ao atualizar perfil após sincronização com Omie:", updateError);
          throw updateError;
        }

        console.log(`Cliente ${userId} sincronizado com Omie. Código: ${omieData.omie_code}`);
      }

      return { success: true, omie_data: omieData };
    } catch (error) {
      console.error("Erro ao sincronizar cliente com Omie:", error);
      return { success: false, error };
    }
  };

  return {
    syncCustomerWithOmie,
  };
};
