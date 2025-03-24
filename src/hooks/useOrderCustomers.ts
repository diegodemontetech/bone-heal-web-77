
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// ID do cliente de teste que queremos excluir
const TEST_CLIENT_ID = "e59a4eb5-3dd5-4f8f-96e5-75f16564bcf3";

export const useOrderCustomers = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  console.log("[useOrderCustomers] Hook inicializado com termo:", customerSearchTerm);

  // Buscar clientes apenas da tabela profiles
  const { data: customers = [], isLoading: isLoadingCustomers } = useQuery({
    queryKey: ["customers", customerSearchTerm],
    queryFn: async () => {
      console.log("[useOrderCustomers] Iniciando busca de clientes com termo:", customerSearchTerm);
      try {
        // Consulta todos os perfis, exceto o cliente de teste
        let query = supabase
          .from("profiles")
          .select("*")
          .neq('id', TEST_CLIENT_ID);
        
        // Aplicar filtro apenas se houver termo de busca
        if (customerSearchTerm && customerSearchTerm.trim() !== "") {
          // Buscar também por código Omie se o termo parecer ser um número
          const isNumericSearch = /^\d+$/.test(customerSearchTerm.trim());
          
          if (isNumericSearch) {
            query = query.or(`full_name.ilike.%${customerSearchTerm}%,omie_code.eq.${customerSearchTerm}`);
          } else {
            query = query.or(
              `full_name.ilike.%${customerSearchTerm}%,` +
              `email.ilike.%${customerSearchTerm}%,` +
              `phone.ilike.%${customerSearchTerm}%`
            );
          }
        }
        
        // Adicionar ordem e limitar resultados
        const { data: profilesData, error: profilesError } = await query
          .order("full_name", { ascending: true })
          .limit(50);

        if (profilesError) {
          console.error("[useOrderCustomers] Erro ao buscar clientes dos perfis:", profilesError);
          throw profilesError;
        }
        
        console.log(`[useOrderCustomers] Encontrados ${profilesData?.length || 0} clientes na busca`, profilesData);
        
        // Garantir que todos os clientes tenham os campos necessários
        const formattedCustomers = (profilesData || []).map(profile => ({
          id: profile.id,
          full_name: profile.full_name || "Nome não informado",
          email: profile.email || "",
          phone: profile.phone || "",
          address: profile.address || "",
          city: profile.city || "",
          state: profile.state || "",
          zip_code: profile.zip_code || "",
          omie_code: profile.omie_code || "",
          omie_sync: profile.omie_sync || false
        }));

        console.log(`[useOrderCustomers] Retornando ${formattedCustomers.length} clientes após formatação`);
        return formattedCustomers;
      } catch (error) {
        console.error("[useOrderCustomers] Exceção na consulta de clientes:", error);
        toast.error("Erro ao consultar clientes");
        return [];
      }
    },
    staleTime: 30000, // 30 segundos
    refetchOnWindowFocus: true
  });

  // Quando um novo cliente é registrado com sucesso
  const handleRegistrationSuccess = (newCustomer: any) => {
    console.log("[useOrderCustomers] Novo cliente registrado:", newCustomer);
    // Invalidar a consulta para forçar uma nova busca de clientes
    queryClient.invalidateQueries({ queryKey: ["customers"] });
    setSelectedCustomer(newCustomer);
    setCustomerDialogOpen(false);
    toast.success("Cliente cadastrado com sucesso!");
  };

  return {
    customers,
    isLoadingCustomers,
    selectedCustomer,
    setSelectedCustomer,
    customerSearchTerm,
    setCustomerSearchTerm,
    customerDialogOpen,
    setCustomerDialogOpen,
    handleRegistrationSuccess
  };
};
