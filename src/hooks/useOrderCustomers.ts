
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useOrderCustomers = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);

  // Buscar clientes diretamente do Supabase
  const { data: customers = [], isLoading: isLoadingCustomers } = useQuery({
    queryKey: ["customers", customerSearchTerm],
    queryFn: async () => {
      console.log("Buscando clientes com filtro:", customerSearchTerm);
      let query = supabase
        .from("profiles")
        .select("*");
      
      if (customerSearchTerm) {
        query = query.or(`full_name.ilike.%${customerSearchTerm}%,email.ilike.%${customerSearchTerm}%`);
      }
      
      query = query.order("full_name");

      const { data, error } = await query;

      if (error) {
        console.error("Erro ao buscar clientes:", error);
        toast.error("Erro ao buscar clientes");
        return [];
      }
      
      console.log(`Encontrados ${data?.length || 0} clientes`);
      return data || [];
    },
  });

  // Quando um novo cliente é registrado com sucesso
  const handleRegistrationSuccess = (newCustomer: any) => {
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
