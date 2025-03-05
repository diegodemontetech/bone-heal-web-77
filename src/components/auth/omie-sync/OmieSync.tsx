
import { useState } from "react";
import { toast } from "sonner";

interface OmieSyncProps {
  userId: string;
}

export const useOmieSync = () => {
  const [syncingWithOmie, setSyncingWithOmie] = useState(false);

  const syncWithOmie = async (userId: string) => {
    try {
      setSyncingWithOmie(true);
      console.log("Sincronizando usuário com Omie:", userId);
      
      const response = await fetch(`${window.location.origin}/api/omie-customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Resposta de erro do servidor:", errorText);
        throw new Error(`Erro na resposta do servidor: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        toast.success("Perfil sincronizado com o Omie");
        return true;
      } else {
        console.error("Erro ao sincronizar com o Omie:", result.error);
        toast.error("Erro ao sincronizar com o Omie: " + (result.error || "Erro desconhecido"));
        return false;
      }
    } catch (omieError) {
      console.error("Erro ao fazer requisição para o Omie:", omieError);
      toast.error("Erro ao sincronizar com o Omie: " + (omieError instanceof Error ? omieError.message : "Erro na comunicação"));
      return false;
    } finally {
      setSyncingWithOmie(false);
    }
  };

  return { syncWithOmie, syncingWithOmie };
};
