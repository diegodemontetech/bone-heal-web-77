
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useOmieSync = () => {
  const [syncingWithOmie, setSyncingWithOmie] = useState(false);

  const syncWithOmie = async (userId: string) => {
    try {
      setSyncingWithOmie(true);
      console.log("Sincronizando usuário com Omie:", userId);
      
      // Usando a função do Supabase para evitar problemas com CORS
      const { data, error } = await supabase.functions.invoke('omie-customer', {
        body: { user_id: userId }
      });
      
      if (error) {
        console.error("Erro na função do Supabase:", error);
        throw new Error(`Erro na resposta do Supabase: ${error.message}`);
      }
      
      console.log("Resposta da sincronização com Omie:", data);
      
      if (data && data.success) {
        // Verificar se o cliente realmente foi sincronizado consultando perfil
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('omie_code, omie_sync')
          .eq('id', userId)
          .single();
          
        if (profileError) {
          console.error("Erro ao verificar perfil após sincronização:", profileError);
        } else if (!profile.omie_code || !profile.omie_sync) {
          console.error("Perfil não foi corretamente sincronizado com Omie");
          throw new Error("Não foi possível confirmar a sincronização com o Omie");
        }
        
        toast.success("Perfil sincronizado com o Omie");
        return true;
      } else {
        console.error("Erro retornado pelo Omie:", data?.error || "Erro desconhecido");
        throw new Error(data?.error || "Erro desconhecido na comunicação com o Omie");
      }
    } catch (omieError) {
      console.error("Erro ao fazer requisição para o Omie:", omieError);
      throw omieError;
    } finally {
      setSyncingWithOmie(false);
    }
  };

  return { syncWithOmie, syncingWithOmie };
};
