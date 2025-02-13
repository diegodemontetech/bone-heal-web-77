
import { useState } from "react";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const TestOmieSync = () => {
  const [isLoading, setIsLoading] = useState(false);

  const syncAllCustomers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-omie-customers');
      
      if (error) throw error;
      
      toast.success(data.message || 'Sincronização concluída!');
      console.log('Resultado da sincronização:', data);
    } catch (error) {
      console.error('Erro na sincronização:', error);
      toast.error('Erro ao sincronizar: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 mb-4 bg-white rounded-lg shadow-lg border">
      <h3 className="text-lg font-semibold mb-2">Sincronização Omie</h3>
      <p className="text-sm text-gray-600 mb-4">
        Clique no botão abaixo para sincronizar todos os clientes do Omie e criar usuários automaticamente.
        As senhas iniciais serão o CPF/CNPJ de cada cliente (apenas números).
      </p>
      <Button 
        onClick={syncAllCustomers} 
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? "Sincronizando..." : "Sincronizar Clientes do Omie"}
      </Button>
    </div>
  );
};

export default TestOmieSync;
