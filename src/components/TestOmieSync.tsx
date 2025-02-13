
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
    <div className="fixed bottom-4 right-4 z-50 p-4 bg-white rounded-lg shadow-lg border">
      <h3 className="text-lg font-semibold mb-2">Teste Omie</h3>
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
