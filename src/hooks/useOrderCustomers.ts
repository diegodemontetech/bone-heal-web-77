
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

  // Buscar clientes da tabela profiles e também da tabela clientes_omie para garantir dados completos
  const { data: customers = [], isLoading: isLoadingCustomers } = useQuery({
    queryKey: ["customers", customerSearchTerm],
    queryFn: async () => {
      console.log("Iniciando busca de clientes com termo:", customerSearchTerm);
      try {
        // Buscar primeiro na tabela profiles (tabela principal)
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
        
        // Limitar resultados e adicionar ordem para consistência
        const { data: profilesData, error: profilesError } = await query
          .order("full_name", { ascending: true })
          .limit(50);

        if (profilesError) {
          console.error("Erro ao buscar clientes dos perfis:", profilesError);
          throw profilesError;
        }
        
        // Buscar na tabela clientes_omie para complementar (caso haja clientes que estão no Omie mas não em profiles)
        const { data: omieData, error: omieError } = await supabase
          .from("clientes_omie")
          .select("codigo_cliente_omie, nome_cliente, email, telefone, endereco, cidade, estado, cep")
          .or(customerSearchTerm ? 
            `nome_cliente.ilike.%${customerSearchTerm}%,` +
            `email.ilike.%${customerSearchTerm}%,` +
            `codigo_cliente_omie.ilike.%${customerSearchTerm}%` : 
            "nome_cliente.neq.''")
          .limit(50);
          
        if (omieError) {
          console.error("Erro ao buscar clientes do Omie:", omieError);
          // Não interrompe o fluxo, apenas continua com os dados de profiles
        }
        
        // Consolidar dados de ambas as tabelas, priorizando profiles
        const consolidatedCustomers = [...(profilesData || [])];
        
        // Adicionar dados da tabela clientes_omie que não existem em profiles
        if (omieData && omieData.length > 0) {
          const existingOmieCodes = new Set(profilesData?.map(p => p.omie_code) || []);
          
          omieData.forEach(omieCustomer => {
            if (!existingOmieCodes.has(omieCustomer.codigo_cliente_omie)) {
              consolidatedCustomers.push({
                id: null, // Será identificado como cliente apenas do Omie
                full_name: omieCustomer.nome_cliente || "Nome não informado",
                email: omieCustomer.email || "",
                phone: omieCustomer.telefone || "",
                address: omieCustomer.endereco || "",
                city: omieCustomer.cidade || "",
                state: omieCustomer.estado || "",
                zip_code: omieCustomer.cep || "",
                omie_code: omieCustomer.codigo_cliente_omie || "",
                omie_sync: true // É do Omie, então consideramos sincronizado
              });
            }
          });
        }
        
        console.log(`Encontrados ${consolidatedCustomers.length} clientes na busca consolidada`);
        
        // Garantir que todos os clientes tenham os campos necessários
        return consolidatedCustomers.map(customer => ({
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
