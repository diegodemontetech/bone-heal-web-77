
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

  // Buscar clientes diretamente da tabela profiles
  const { data: customers = [], isLoading: isLoadingCustomers } = useQuery({
    queryKey: ["customers", customerSearchTerm],
    queryFn: async () => {
      console.log("Iniciando busca de clientes na tabela profiles com termo:", customerSearchTerm);
      try {
        let query = supabase
          .from("profiles")
          .select("id, full_name, email, phone, address, city, state, zip_code, omie_code, omie_sync");
        
        // Aplicar filtro apenas se houver termo de busca
        if (customerSearchTerm && customerSearchTerm.trim() !== "") {
          // Usar ilike para cada campo individualmente para melhor corresponder a busca
          query = query.or(
            `full_name.ilike.%${customerSearchTerm}%,` +
            `email.ilike.%${customerSearchTerm}%,` +
            `phone.ilike.%${customerSearchTerm}%`
          );
        }
        
        // Limitar resultados e adicionar ordem para consistência
        const { data, error } = await query
          .order("full_name", { ascending: true })
          .limit(50);

        if (error) {
          console.error("Erro ao buscar clientes do Supabase:", error);
          toast.error("Erro ao buscar clientes");
          return [];
        }
        
        console.log(`Encontrados ${data?.length || 0} clientes na tabela profiles:`, data);
        
        // Garantir que todos os clientes tenham os campos necessários
        return data?.map(customer => ({
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
        })) || [];
      } catch (error) {
        console.error("Exceção na consulta de clientes:", error);
        toast.error("Erro ao consultar clientes");
        return [];
      }
    },
    staleTime: 30000, // 30 segundos (reduzido para atualizar mais frequentemente)
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
