
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ShippingRate } from "../types";
import { useAuthContext } from "@/hooks/auth/auth-context";

export const useShippingRates = () => {
  const { session } = useAuthContext();
  
  const { 
    data: shippingRates, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ["shipping-rates"],
    queryFn: async () => {
      console.log("Buscando taxas de frete do Supabase...");
      
      try {
        // Verificar se temos uma sessão
        console.log("Status da sessão:", session ? "Autenticado" : "Não autenticado");
        
        // Testar conexão básica primeiro
        const { data: versionData, error: versionError } = await supabase.rpc('version');
        
        if (versionError) {
          console.error("Erro ao verificar versão:", versionError);
          throw new Error(`Falha na conexão com Supabase: ${versionError.message}`);
        }
        
        console.log("Conexão com Supabase estabelecida, versão:", versionData);
        console.log("Buscando dados...");
        
        const { data, error, status, statusText } = await supabase
          .from("shipping_rates")
          .select("*")
          .order("state", { ascending: true })
          .order("region_type", { ascending: true })
          .order("service_type", { ascending: true });

        if (error) {
          console.error("Erro ao buscar taxas de frete:", error);
          console.error("Status HTTP:", status, statusText);
          console.error("Detalhes completos do erro:", {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          
          toast.error(`Erro ao carregar taxas: ${error.message}`);
          throw error;
        }
        
        console.log(`Taxas de frete encontradas: ${data?.length || 0}`);
        if (data?.length) {
          console.log("Exemplo de taxa recuperada:", data[0]);
        } else {
          console.log("Nenhuma taxa de frete encontrada no banco");
        }
        
        return data as ShippingRate[];
      } catch (err: any) {
        console.error("Erro completo na consulta:", err);
        const errorMessage = err.message || "Erro na comunicação com o banco de dados";
        console.error("Detalhes:", errorMessage);
        toast.error(errorMessage);
        throw err;
      }
    },
    enabled: Boolean(session), // Só executar a query quando o usuário estiver autenticado
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  // Monitorar quando os dados são carregados
  useEffect(() => {
    if (shippingRates) {
      console.log(`Taxas de frete carregadas: ${shippingRates.length}`);
    }
  }, [shippingRates]);

  // Se encontrar um erro na busca das taxas, exibir no console
  useEffect(() => {
    if (isError && error) {
      console.error("Erro detalhado na query de taxas de frete:", error);
      if (error instanceof Error) {
        console.error("Mensagem de erro:", error.message);
        console.error("Stack trace:", error.stack);
      }
    }
  }, [isError, error]);

  return {
    shippingRates,
    isLoading,
    isError,
    error,
    refetch
  };
};
