
import { useEffect } from "react";
import ShippingRatesTable from "@/components/admin/shipping/ShippingRatesTable";
import { supabase } from "@/integrations/supabase/client";

const AdminShippingRates = () => {
  useEffect(() => {
    console.log("Renderizando página de taxas de frete");
    
    // Verificar a conexão com o Supabase
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase.from('shipping_rates').select('count(*)', { count: 'exact' });
        
        if (error) {
          console.error("Erro ao verificar conexão com tabela shipping_rates:", error);
        } else {
          console.log("Conexão com Supabase verificada com sucesso. Contagem de taxas:", data);
        }
      } catch (err) {
        console.error("Falha ao testar conexão com Supabase:", err);
      }
    };
    
    checkConnection();
  }, []);
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Gerenciamento de Fretes</h1>
      <div className="mb-4 text-sm text-muted-foreground">
        Configure as taxas de frete por estado e tipo de serviço. Os valores serão utilizados para cálculo automático no checkout.
      </div>
      <ShippingRatesTable />
    </div>
  );
};

export default AdminShippingRates;
