
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useOrderCustomers = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);

  console.log("useOrderCustomers iniciado, termo:", customerSearchTerm);

  // Buscar clientes diretamente do Supabase
  const { data: customers = [], isLoading: isLoadingCustomers } = useQuery({
    queryKey: ["customers", customerSearchTerm],
    queryFn: async () => {
      console.log("Iniciando busca de clientes no Supabase com termo:", customerSearchTerm);
      try {
        let query = supabase
          .from("profiles")
          .select("id, full_name, email, phone, address, city, state, zip_code");
        
        // Aplicar filtro apenas se houver termo de busca
        if (customerSearchTerm && customerSearchTerm.trim() !== "") {
          query = query.or(`full_name.ilike.%${customerSearchTerm}%,email.ilike.%${customerSearchTerm}%,phone.ilike.%${customerSearchTerm}%`);
        }
        
        const { data, error } = await query
          .order("full_name")
          .limit(50);

        if (error) {
          console.error("Erro ao buscar clientes do Supabase:", error);
          toast.error("Erro ao buscar clientes");
          return [];
        }
        
        console.log(`Encontrados ${data?.length || 0} clientes no Supabase:`, data);
        return data || [];
      } catch (error) {
        console.error("Exceção na consulta de clientes:", error);
        toast.error("Erro ao consultar clientes");
        return [];
      }
    },
    refetchOnWindowFocus: false
  });

  // Quando um novo cliente é registrado com sucesso
  const handleRegistrationSuccess = (newCustomer: any) => {
    console.log("Novo cliente registrado:", newCustomer);
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
