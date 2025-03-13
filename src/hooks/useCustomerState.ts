
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Customer {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  omie_code?: string;
  omie_sync?: boolean;
}

export const useCustomerState = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCustomers = async () => {
    try {
      console.log("Iniciando busca de clientes...");
      setIsLoadingCustomers(true);
      
      // Buscar na tabela profiles
      let profilesQuery = supabase
        .from('profiles')
        .select('id, full_name, email, phone, address, city, state, zip_code, omie_code, omie_sync')
        .order('full_name');

      if (searchTerm) {
        // Verificar se a busca parece ser um código numérico
        const isNumericSearch = /^\d+$/.test(searchTerm.trim());
        
        if (isNumericSearch) {
          profilesQuery = profilesQuery.or(
            `full_name.ilike.%${searchTerm}%,omie_code.ilike.%${searchTerm}%`
          );
        } else {
          profilesQuery = profilesQuery.or(
            `full_name.ilike.%${searchTerm}%,` +
            `email.ilike.%${searchTerm}%,` +
            `phone.ilike.%${searchTerm}%`
          );
        }
      }

      const { data: profilesData, error: profilesError } = await profilesQuery;

      if (profilesError) {
        console.error('Erro na consulta de perfis:', profilesError);
        throw profilesError;
      }

      // Buscar na tabela clientes_omie
      const { data: omieData, error: omieError } = await supabase
        .from("clientes_omie")
        .select("codigo_cliente_omie, nome_cliente, email, telefone, endereco, cidade, estado, cep")
        .or(searchTerm ? 
          `nome_cliente.ilike.%${searchTerm}%,` +
          `email.ilike.%${searchTerm}%,` +
          `codigo_cliente_omie.ilike.%${searchTerm}%` : 
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

      const formattedCustomers = consolidatedCustomers.map(customer => ({
        id: customer.id,
        full_name: customer.full_name || 'Sem nome',
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        zip_code: customer.zip_code,
        omie_code: customer.omie_code,
        omie_sync: customer.omie_sync
      }));

      console.log(`Encontrados ${formattedCustomers.length} clientes na busca consolidada`);
      setCustomers(formattedCustomers);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      toast.error('Erro ao carregar lista de clientes');
    } finally {
      setIsLoadingCustomers(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [searchTerm]); // A busca é refeita quando o searchTerm muda

  const refreshCustomers = () => {
    fetchCustomers();
  };

  return {
    customers,
    selectedCustomer,
    setSelectedCustomer,
    isLoadingCustomers,
    searchTerm,
    setSearchTerm,
    refreshCustomers
  };
};
