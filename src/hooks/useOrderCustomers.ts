
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useOrderCustomers = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  console.log("useOrderCustomers hook inicializado com termo:", customerSearchTerm);

  // Buscar clientes apenas da tabela profiles
  const { data: customers = [], isLoading: isLoadingCustomers } = useQuery({
    queryKey: ["customers", customerSearchTerm],
    queryFn: async () => {
      console.log("Iniciando busca de clientes com termo:", customerSearchTerm);
      try {
        // Buscar na tabela profiles
        let query = supabase
          .from("profiles")
          .select("id, full_name, email, phone, address, city, state, zip_code, omie_code, omie_sync");
        
        // Aplicar filtro apenas se houver termo de busca
        if (customerSearchTerm && customerSearchTerm.trim() !== "") {
          // Buscar também por código Omie se o termo parecer ser um número
          const isNumericSearch = /^\d+$/.test(customerSearchTerm.trim());
          
          if (isNumericSearch) {
            query = query.or(`full_name.ilike.%${customerSearchTerm}%,omie_code.ilike.%${customerSearchTerm}%`);
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
          console.error("Erro ao buscar clientes dos perfis:", profilesError);
          throw profilesError;
        }
        
        console.log(`Encontrados ${profilesData.length} clientes na busca`);
        
        // Garantir que todos os clientes tenham os campos necessários
        return profilesData.map(customer => ({
          id: customer.id,
          full_name: customer.full_name || "Nome não informado",
          email: customer.email || "",
          phone: customer.phone || "",
          address: customer.address || "",
          city: customer.city || "",
          state: customer.state || "",
          zip_code: customer.zip_code || "",
          omie_code: customer.omie_code || "",
          omie_sync: customer.omie_sync || false
        }));
      } catch (error) {
        console.error("Exceção na consulta de clientes:", error);
        toast.error("Erro ao consultar clientes");
        return [];
      }
    },
    staleTime: 30000, // 30 segundos
    refetchOnWindowFocus: true
  });

  // Quando um novo cliente é registrado com sucesso
  const handleRegistrationSuccess = (newCustomer: any) => {
    console.log("Novo cliente registrado:", newCustomer);
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
